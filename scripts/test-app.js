import { db } from '../lib/db.js';
import { hashPassword, comparePassword, signToken, verifyToken } from '../lib/auth.js';

async function runTests() {
  console.log("=========================================");
  console.log("RUNNING RAGUSMA FARMS END-TO-END TESTS");
  console.log("=========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // TEST 1: Database Initialization & Categories
  console.log("1. Testing Categories & Products...");
  const categories = db.categories.getAll();
  assert(categories.length >= 6, `Categories loaded: found ${categories.length}`);
  const liveChickenCat = categories.find(c => c.slug === 'live-chicken');
  assert(Boolean(liveChickenCat), "Found 'Live Chicken' category");

  const products = db.products.getAll();
  assert(products.length >= 7, `Products loaded: found ${products.length}`);
  const broiler = products.find(p => p.id === 'prod_live_broiler');
  assert(Boolean(broiler), "Found 'Heavyweight Farm Broiler'");
  assert(broiler.price === 6500, `Broiler price is ₦${broiler.price}`);

  // TEST 2: Delivery Pricing Rules
  console.log("\n2. Testing Delivery Pricing Rules (Section 7E)...");
  const deliveryLocations = db.deliveryLocations.getAll();
  const tunga = deliveryLocations.find(l => l.name.toLowerCase() === 'tunga');
  assert(Boolean(tunga), "Tunga delivery location exists");
  assert(tunga.charge === 0, `Tunga charge must be FREE (₦0), actual: ₦${tunga.charge}`);

  const regional = ['Bakungu', 'Bosu', 'Mokunkele', 'Shango'];
  for (const name of regional) {
    const loc = deliveryLocations.find(l => l.name.toLowerCase() === name.toLowerCase());
    assert(Boolean(loc), `Location '${name}' exists in system`);
    if (loc) {
      assert(loc.charge === 1000, `'${name}' charge must be ₦1,000, actual: ₦${loc.charge}`);
    }
  }

  // TEST 3: User Authentication & Security
  console.log("\n3. Testing Authentication & Passwords...");
  const adminUser = db.users.findByEmail('admin@ragusmafarms.com');
  assert(Boolean(adminUser), "Admin user exists");
  assert(adminUser.role === 'admin', `Admin role verified: ${adminUser.role}`);

  const isPasswordValid = await comparePassword('AdminPassword2026!', adminUser.passwordHash);
  assert(isPasswordValid, "Admin password hash verification succeeds");

  const token = signToken(adminUser);
  assert(Boolean(token), "JWT token generated");
  const decoded = verifyToken(token);
  assert(decoded.userId === adminUser.id, "JWT decoded userId matches");
  assert(decoded.role === 'admin', "JWT decoded role is admin");

  // TEST 4: Stock Deduction & Safe Order Placement
  console.log("\n4. Testing Order Creation & Stock Deduction...");
  const initialStock = broiler.stock;
  const orderQty = 3;

  const testOrder = db.orders.create({
    customerId: 'usr_cust_001',
    customerName: 'Ibrahim Sani',
    customerEmail: 'customer@gmail.com',
    customerPhone: '+234 802 345 6789',
    deliveryMethod: 'delivery',
    deliveryLocationId: tunga.id,
    deliveryLocationName: tunga.name,
    deliveryAddress: 'No. 12 Bosu Street, Tunga',
    deliveryFee: tunga.charge,
    subtotal: broiler.price * orderQty,
    totalAmount: (broiler.price * orderQty) + tunga.charge,
    paymentStatus: 'pending',
    paymentMethod: 'test_mode',
    items: [
      {
        productId: broiler.id,
        productName: broiler.name,
        productUnit: broiler.unit,
        unitPrice: broiler.price,
        quantity: orderQty,
        subtotal: broiler.price * orderQty
      }
    ]
  });

  assert(Boolean(testOrder), `Order #${testOrder.id} created`);
  assert(testOrder.orderStatus === 'Pending', `Initial status is Pending`);

  const updatedBroiler = db.products.findById(broiler.id);
  assert(updatedBroiler.stock === initialStock - orderQty, 
    `Stock deducted: previous ${initialStock}, current ${updatedBroiler.stock}`);

  // TEST 5: Status Lifecycle
  console.log("\n5. Testing Order Status Transitions...");
  const updatedStatus = db.orders.updateStatus(testOrder.id, 'Processing', 'Alhaji Madaki', 'Birds prepared');
  assert(updatedStatus.orderStatus === 'Processing', "Order status successfully updated to Processing");

  const orderWithDetails = db.orders.findById(testOrder.id);
  assert(orderWithDetails.history.length >= 2, `Order status history logged: ${orderWithDetails.history.length} events`);

  // TEST 6: In-App Notifications
  console.log("\n6. Testing Notification Dispatch...");
  const customerNotifs = db.notifications.getByUserId('usr_cust_001');
  assert(customerNotifs.length > 0, `Customer received notifications: found ${customerNotifs.length}`);

  // Summary
  console.log("\n=========================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

