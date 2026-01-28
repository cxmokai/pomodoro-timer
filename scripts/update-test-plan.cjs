#!/usr/bin/env node

/**
 * TEST_PLAN.md Update Script
 *
 * Updates test case status in TEST_PLAN.md file.
 *
 * Usage:
 *   node scripts/update-test-plan.js --help
 *   node scripts/update-test-plan.js --id AUTH-01 --pass
 *   node scripts/update-test-plan.js --id SYNC-01 --fail --remark "Timeout error"
 *   node scripts/update-test-plan.js --id AUTH-08 --pass --remark "All auth tests completed"
 */

const fs = require('fs');
const path = require('path');

const TEST_PLAN_PATH = path.join(__dirname, '..', 'docs', 'TEST_PLAN.md');

const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
TEST_PLAN.md Update Script

Usage:
  node scripts/update-test-plan.js --id <test-id> --pass|--fail [--remark <text>]

Options:
  --id <test-id>     Test case ID (e.g., AUTH-01, SYNC-02)
  --pass              Mark test as passed (✅)
  --fail              Mark test as failed (❌)
  --remark <text>     Optional remark to add to test case

Examples:
  node scripts/update-test-plan.js --id AUTH-01 --pass
  node scripts/update-test-plan.js --id SYNC-01 --fail --remark "Timeout error"
  node scripts/update-test-plan.js --id AUTH-08 --pass --remark "All auth tests completed"
`);
    process.exit(0);
  } else if (args[i] === '--id') {
    options.id = args[++i];
  } else if (args[i] === '--pass') {
    options.result = '✅';
  } else if (args[i] === '--fail') {
    options.result = '❌';
  } else if (args[i] === '--remark') {
    options.remark = args[++i];
  }
}

if (!options.id) {
  console.error('❌ Error: --id is required');
  process.exit(1);
}

if (!options.result) {
  console.error('❌ Error: --pass or --fail is required');
  process.exit(1);
}

function updateTestPlan(id, result, remark) {
  try {
    let content = fs.readFileSync(TEST_PLAN_PATH, 'utf8');
    const lines = content.split('\n');

    let testFound = false;
    let testLineNumber = -1;
    let statusColumnIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim().startsWith(`| ${id} `)) {
        testFound = true;
        testLineNumber = i;

        const columns = line.split('|').map((c) => c.trim());
        statusColumnIndex = columns.length - 2;

        lines[i] = line.replace(/⬜/, result);
        break;
      }
    }

    if (!testFound) {
      console.error(`❌ Test case ${id} not found in TEST_PLAN.md`);
      process.exit(1);
    }

    let resultSectionFound = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith(`| ${id} |`)) {
        const parts = lines[i].split('|').map((p) => p.trim());
        parts[1] = result;

        if (remark !== undefined) {
          parts[2] = remark;
        }

        lines[i] = parts.join(' | ');
        resultSectionFound = true;
        break;
      }
    }

    if (!resultSectionFound) {
      console.warn(
        `⚠️  Result section for ${id} not found, only main table updated`
      );
    }

    let testedCount = 0;
    let passedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('**已测试**') || line.includes('**已测试**')) {
        for (let j = i - 50; j < i; j++) {
          if (
            j >= 0 &&
            lines[j].startsWith('| ') &&
            !lines[j].includes('用例ID')
          ) {
            testedCount += (lines[j].match(/[✅❌]/g) || []).length;
            passedCount += (lines[j].match(/✅/g) || []).length;
            failedCount += (lines[j].match(/❌/g) || []).length;
          }
        }

        lines[i] = lines[i].replace(/\d+/, testedCount);
        lines[i + 1] = lines[i + 1].replace(/\d+/, passedCount);
        lines[i + 2] = lines[i + 2].replace(/\d+/, failedCount);
        lines[i + 3] = lines[i + 3].replace(/\d+/, 42 - testedCount);
        break;
      }
    }

    fs.writeFileSync(TEST_PLAN_PATH, lines.join('\n'), 'utf8');

    console.log(`✅ Updated ${id}: ${result}`);
    if (remark) {
      console.log(`   Remark: ${remark}`);
    }
    console.log(
      `   Summary: ${testedCount} tested, ${passedCount} passed, ${failedCount} failed`
    );
  } catch (error) {
    console.error('❌ Error updating TEST_PLAN.md:', error.message);
    process.exit(1);
  }
}

updateTestPlan(options.id, options.result, options.remark);
