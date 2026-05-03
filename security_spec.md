# Security Specification for Barbara Higuera App

## Data Invariants
1. A Ritual (Product) must have a valid ID and price.
2. Only Admins can create, update, or delete Rituales.
3. Site Settings can only be modified by Admins.
4. Public can read Rituales and Site Settings.

## The Dirty Dozen Payloads (Red Team)

1. **Unauthorized Write**: Non-admin user tries to create a product.
2. **Price Poisoning**: Setting a negative price.
3. **Identity Spoofing**: Changing a product ID during update.
4. **Shadow Field injection**: Adding `isVerified: true` to a product.
5. **PII Leak**: Admin collection should not be readable by public.
6. **Malicious ID**: Creating a project with ID `../../../etc/passwd`.
7. **Size Attack**: Sending a 2MB string description.
8. **Invalid Category**: Setting category to `illegal`.
9. **Settings Overwrite**: Public user trying to change the hero image.
10. **Array Explosion**: Sending an options array with 1000 items.
11. **Type Confusion**: Sending price as a string "100".
12. **System Field Overwrite**: (If any system fields were present).

## Test Runner (Verification Plan)
We will use rules tests to ensure these are blocked.
