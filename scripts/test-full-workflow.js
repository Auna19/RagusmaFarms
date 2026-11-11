import { db } from '../lib/db.js';
import { hashPassword, comparePassword, signToken } from '../lib/auth.js';

async function testFullWorkflow() {
  console.log("=================================================");
  console.log("RAGUSMA FARMS FULL WORKFLOW VERIFICATION SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, desc) {
    if (condition) {
      console.log(`  ✓ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${desc}`);
      failed++;
    }
  }

  // 1. Customer Registration & Token
  console.log("1. Customer Registration & Authentication");
  const testEmail = `newcustomer_${Date.now()}@example.com`;
  const passwordHash = await hashPassword('TestPassword123!');
  const newUser = db.users.create({
    fullName: "Amina Mohammed",
    email: testEmail,
    phone: "+234 803 111 2233",
    passwordHash,
    role: "customer"
  });
  assert(Boolean(newUser?.id), "Customer account created successfully");
  assert(newUser.email === testEmail, "Customer email stored accurately");
  
  const token = signToken(newUser);
  assert(Boolean(token), "JWT authentication token generated");

  // 2. Product Query & Stock Check
  console.log("\n2. Product Browsing & Inventory Verification");
  const activeProducts = db.products.getAll({ onlyActive: true });
  assert(activeProducts.length >= 7, `Found ${activeProducts.length} active products in catalogue`);
  
  const fishProduct = activeProducts.find(p => p.categoryId === 'cat_fish');
  assert(Boolean(fishProduct), "Fresh Catfish product is active and available");
  const initialFishStock = fishProduct.stock;

  // 3. Checkout with Tunga (Free Delivery)
  console.log("\n3. Order Placement: Tunga (Free Delivery ₦0)");
  const tungaOrder = db.orders.create({
    customerId: newUser.id,
    customerName: newUser.fullName,
    customerEmail: newUser.email,
    customerPhone: newUser.phone,
    deliveryMethod: 'delivery',
    deliveryLocationId: 'loc_tunga',
    deliveryLocationName: 'Tunga (Free Delivery)',
    deliveryAddress: 'House 14, Near Tunga Roundabout, Minna',
    deliveryFee: 0,
    subtotal: fishProduct.price * 2,
    totalAmount: fishProduct.price * 2 + 0,
    paymentStatus: 'successful',
    paymentMethod: 'test_mode',
    paymentReference: 'REF-TUNGA-TEST',
    items: [
      {
        productId: fishProduct.id,
        productName: fishProduct.name,
        productUnit: fishProduct.unit,
        unitPrice: fishProduct.price,
        quantity: 2,
        subtotal: fishProduct.price * 2
      }
    ]
  });
  assert(tungaOrder.deliveryFee === 0, "Tunga delivery fee is ₦0 (Free)");
  assert(tungaOrder.totalAmount === fishProduct.price * 2, "Total amount equals subtotal without delivery surcharge");
  
  const updatedFish = db.products.findById(fishProduct.id);
  assert(updatedFish.stock === initialFishStock - 2, `Stock deducted from ${initialFishStock} to ${updatedFish.stock}`);

  // 4. Checkout with Shango (₦1,000 Flat Rate)
  console.log("\n4. Order Placement: Shango (₦1,000 Delivery)");
  const rabbitProduct = activeProducts.find(p => p.categoryId === 'cat_rabbits');
  assert(Boolean(rabbitProduct), "Rabbitry product found");
  
  const shangoOrder = db.orders.create({
    customerId: newUser.id,
    customerName: newUser.fullName,
    customerEmail: newUser.email,
    customerPhone: newUser.phone,
    deliveryMethod: 'delivery',
    deliveryLocationId: 'loc_shango',
    deliveryLocationName: 'Shango',
    deliveryAddress: 'Plot 7, Shango New Layout, Minna',
    deliveryFee: 1000,
    subtotal: rabbitProduct.price,
    totalAmount: rabbitProduct.price + 1000,
    paymentStatus: 'successful',
    paymentMethod: 'bank_transfer',
    paymentReference: 'REF-SHANGO-TEST',
    items: [
      {
        productId: rabbitProduct.id,
        productName: rabbitProduct.name,
        productUnit: rabbitProduct.unit,
        unitPrice: rabbitProduct.price,
        quantity: 1,
        subtotal: rabbitProduct.price
      }
    ]
  });
  assert(shangoOrder.deliveryFee === 1000, "Shango delivery charge is ₦1,000 flat");
  assert(shangoOrder.totalAmount === rabbitProduct.price + 1000, "Total accurately includes ₦1,000 delivery fee");

  // 5. Admin Order Lifecycle Transition
  console.log("\n5. Order Status Lifecycle (Admin Processing)");
  const statusSteps = ['processing', 'out_for_delivery', 'delivered'];
  for (const nextStatus of statusSteps) {
    db.orders.updateStatus(shangoOrder.id, nextStatus, `Updated to ${nextStatus} by Farm Dispatch Desk`);
    const check = db.orders.findById(shangoOrder.id);
    assert(check.status === nextStatus, `Order advanced to '${nextStatus}'`);
  }
  const completedOrder = db.orders.findById(shangoOrder.id);
  assert(completedOrder.statusHistory.length >= 4, `Order status history tracked ${completedOrder.statusHistory.length} lifecycle events`);

  // 6. Admin Inventory Audit Log
  console.log("\n6. Inventory Restock & Audit Logging");
  const initialBroiler = db.products.findById('prod_live_broiler');
  const restockQty = 50;
  db.inventory.adjustStock(
    'prod_live_broiler',
    restockQty,
    'restock',
    'Batch 24 Hatchery Delivery - 50 Healthy Birds',
    'usr_admin_001'
  );
  const restockedBroiler = db.products.findById('prod_live_broiler');
  assert(restockedBroiler.stock === initialBroiler.stock + restockQty, `Stock increased from ${initialBroiler.stock} to ${restockedBroiler.stock}`);
  
  const auditLogs = db.inventory.getLogs('prod_live_broiler');
  assert(auditLogs.length > 0, "Inventory audit log entry recorded");
  assert(auditLogs.some(l => l.reason && l.reason.includes('Hatchery Delivery')), "Audit log captures administrator restock rationale");

  // 7. Dynamic Category & Product Addition (Admin CMS)
  console.log("\n7. Dynamic Product Creation (Admin Capability)");
  const newProduct = db.products.create({
    name: "Pure Farm-Fresh Quail Eggs (Crate of 30)",
    categoryId: "cat_other",
    description: "Nutrient-rich, organic quail eggs harvested fresh daily from our specialized aviary unit.",
    price: 3200,
    promotionalPrice: 2900,
    unit: "per crate (30 eggs)",
    stock: 45,
    isAvailable: true,
    isFeatured: true,
    images: ["/assets/brand-sheet.webp"],
    specifications: {
      "Harvest": "Daily Sunrise Collection",
      "Feed": "Organic Seed & Mineral Mash",
      "Storage": "Cool dry conditions (up to 30 days)"
    }
  });
  assert(Boolean(newProduct?.id), `New product '${newProduct.name}' created dynamically`);
  assert(newProduct.slug.includes('quail-eggs'), `Automatic SEO slug generated: ${newProduct.slug}`);
  
  const foundNew = db.products.findBySlug(newProduct.slug);
  assert(Boolean(foundNew), "New product retrieved by generated slug");

  // 8. Contact & Store Settings Verification
  console.log("\n8. Contact & Brand Settings");
  const settings = db.settings.get();
  const content = db.content.get();
  assert(content.contact.phone === '+234 813 583 4368', "Phone correctly set to +234 813 583 4368");
  assert(content.contact.farmAddress.includes('Tunga goro'), "Farm address is Tunga Goro, behind FGC Minna");
  assert(settings.businessName === 'Ragusma Farms NG®', "Business name is Ragusma Farms NG®");

  console.log("\n=================================================");
  console.log(`WORKFLOW SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");
}

testFullWorkflow();
