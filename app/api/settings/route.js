import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin, getCurrentUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = getCurrentUser(req);
    const settings = await db.settings.get();

    // If user is not admin, sanitize secret keys
    if (!user || user.role !== 'admin') {
      const publicSettings = {
        farmName: settings.farmName,
        currency: settings.currency,
        farmPickupAddress: settings.farmPickupAddress,
        pickupInstructions: settings.pickupInstructions,
        bankTransfer: {
          enabled: settings.bankTransfer?.enabled,
          bankName: settings.bankTransfer?.bankName,
          accountName: settings.bankTransfer?.accountName,
          accountNumber: settings.bankTransfer?.accountNumber,
          instructions: settings.bankTransfer?.instructions
        },
        paystack: {
          enabled: settings.paystack?.enabled,
          testMode: settings.paystack?.testMode,
          publicKey: settings.paystack?.publicKey
        },
        freeDeliveryTunga: settings.freeDeliveryTunga
      };
      return NextResponse.json({ success: true, settings: publicSettings });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    requireAdmin(req);
    const body = await req.json();

    const updated = await db.settings.update(body);

    return NextResponse.json({
      success: true,
      message: 'Business settings updated successfully!',
      settings: updated
    });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

