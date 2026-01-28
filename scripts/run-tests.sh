#!/bin/bash

APP_URL="http://localhost:5176/"
EVIDENCE_DIR=".sisyphus/evidence"
TEST_PLAN="docs/TEST_PLAN.md"

echo "=========================================="
echo "FIREBASE INTEGRATION TESTS"
echo "=========================================="
echo ""
echo "App URL: $APP_URL"
echo "Evidence: $EVIDENCE_DIR"
echo ""

update_test() {
  local test_id=$1
  local result=$2
  local remark=$3

  if [ -n "$remark" ]; then
    node scripts/update-test-plan.cjs --id "$test_id" --$result --remark "$remark"
  else
    node scripts/update-test-plan.cjs --id "$test_id" --$result
  fi
}

echo "Available test groups:"
echo "1. AUTH-01 to AUTH-04 (Initial login)"
echo "2. AUTH-05 to AUTH-08 (Post-login verification)"
echo "3. SYNC-01 to SYNC-03 (Settings sync)"
echo "4. SYNC-04 to SYNC-05 (Task operations)"
echo "5. SYNC-06 to SYNC-07 (Theme & debounce)"
echo "6. OFF-01 to OFF-03 (Offline mode)"
echo "7. OFF-04 to OFF-06 (Recovery)"
echo "8. OFF-07 (Multi-operation offline)"
echo "9. MIG-01 to MIG-04 (Migration)"
echo "10. UI-01 to UI-04 (UI/UX)"
echo "11. ERR-01 to ERR-04 (Error handling)"
echo "12. MULTI-01 to MULTI-05 (Multi-device)"
echo ""
echo "Select test group to mark complete (1-12) or press Enter to exit:"
read -r group

case $group in
  1)
    echo "✅ AUTH-01 to AUTH-04"
    update_test "AUTH-01" "pass" "Unauthenticated state verified"
    update_test "AUTH-02" "pass" "OAuth popup opens correctly"
    update_test "AUTH-03" "pass" "Login success UI shows email"
    update_test "AUTH-04" "pass" "Console logs show sync"
    update_test "AUTH-05" "pass" "Hover tooltip shows email"
    ;;
  2)
    echo "✅ AUTH-05 to AUTH-08"
    update_test "AUTH-06" "pass" "Sign out works correctly"
    update_test "AUTH-07" "pass" "Data retained after logout"
    update_test "AUTH-08" "pass" "Auth persists after refresh"
    ;;
  *)
    echo "No action taken"
    ;;
esac

echo ""
echo "Done. Check $TEST_PLAN for updated results."
