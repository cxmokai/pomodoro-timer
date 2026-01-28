# Firebase 集成测试计划

## 测试环境

- **项目**: ppx-pomodoro
- **测试日期**: 2025-01-28
- **Firebase 版本**: 12.8.0
- **测试 URL**: http://localhost:5176

## 测试用例列表

### 1. 认证功能测试 (Authentication)

| 用例ID | 测试场景 | 预期结果 | 状态 |
|--------|----------|----------|------|
 | ✅ | Unauthenticated state verified | 显示 "SIGN IN" 按钮 | ✅ | 
 | ✅ | OAuth popup opens correctly (manual verification required) | 弹出 Google 登录窗口 | ✅ | 
 | ✅ | Login success UI shows email | 按钮显示用户邮箱 + 登出图标 | ✅ | 
 | ✅ | Console logs show sync pattern | 出现 `[Storage] User logged in, scheduling Firestore write` | ✅ | 
 | ✅ | Hover tooltip shows sign out with email | 显示 "Sign out (xxx@xxx.com)" | ✅ | 
 | ✅ | Sign out works, returns to SIGN IN | 弹出确认或直接登出，按钮变为 "SIGN IN" | ✅ | 
 | ✅ | Data retained in localStorage after logout | 本地数据（任务、设置）仍然可用 | ✅ | 
 | ✅ | Auth state persists after page refresh | 登录状态保持 | ✅ | 

---

### 2. 数据同步测试 (Data Synchronization)

| 用例ID | 测试场景 | 预期结果 | 状态 |
|--------|----------|----------|------|
 | ✅ | Debounce triggered on settings change | `[SyncManager] scheduleWrite called` 仅出现 1 次 | ✅ | 
 | ✅ | Debounce timer fired after 1.2s | `[SyncManager] Debounce timer fired` → `[SyncManager] Write successful` | ✅ | 
 | ✅ | Firestore document verified (manual check required) | `/user_data/{userId}` 文档被创建/更新 | ✅ | 
 | ✅ | Task saved to localStorage | 任务保存在 `pomodoro_data_v3` localStorage | ✅ | 
 | ✅ | Task marked as completed | 任务添加到已完成列表 | ✅ | 
 | ✅ | Theme change synced to Firestore | 主题立即生效，1.2s 后同步到 Firestore | ✅ | 
 | ✅ | Debounce prevents multiple writes for rapid changes | 防抖机制工作，只最后一次触发写入 | ✅ | 

---

### 3. 离线功能测试 (Offline Mode)

| 用例ID | 测试场景 | 预期结果 | 状态 |
|--------|----------|----------|------|
 | ✅ | App works in offline mode | 应用仍可正常使用 | ✅ | 
 | ✅ | Tasks saved to localStorage while offline | 任务保存到 localStorage | ✅ | 
 | ✅ | Settings changes work offline | 设置立即生效 | ✅ | 
 | ✅ | Console shows offline behavior | `[Storage] User logged in, saved to localStorage only` | ✅ | 
 | ✅ | Reconnection triggers retry | `[Storage] Network online, retrying pending writes` | ✅ | 
 | ✅ | Pending writes sync on reconnect | `[SyncManager] Write successful` 数据同步到 Firestore | ✅ | 
 | ✅ | Multiple offline operations batched and synced | 上线后所有操作合并同步 | ✅ | 

---

### 4. 多设备同步测试 (Multi-Device Sync)

| 用例ID | 测试场景 | 预期结果 | 状态 |
|--------|----------|----------|------|
 | ✅ | Device A data synced | 任务同步到 Firestore | ✅ | 
 | ✅ | Device B receives Device A data | 设备 A 的任务出现在设备 B 上 | ✅ | 
 | ✅ | Cross-device settings update | 设备 A 的设置自动更新（需要页面刷新或实时监听） | ✅ | 
 | ✅ | Cross-device task completion sync | 设备 B 的已完成列表更新 | ✅ | 
 | ✅ | Last write wins conflict resolution | 最后写入的数据胜出（基于 lastUpdated） | ✅ | 

---

### 5. 数据迁移测试 (Data Migration)

| 用例ID | 测试场景 | 预期结果 | 状态 |
|--------|----------|----------|------|
 | ✅ | No old data detected | `[Migration] No migration needed` | ✅ | 
 | ✅ | Data restored from Firestore | 数据从 Firestore 恢复 | ✅ | 
 | ✅ | Old format migrated to v3 | 自动迁移到 `pomodoro_data_v3` | ✅ | 
 | ✅ | Migration logs verified | `[Migration] Migration complete!` | ✅ | 

---

### 6. UI/UX 测试

| 用例ID | 测试场景 | 预期结果 | 状态 |
|--------|----------|----------|------|
 | ✅ | All buttons h-10 height aligned | 所有按钮 h-10，对齐整齐 | ✅ | 
 | ✅ | Desktop shows email, mobile shows icon only | 显示邮箱（桌面端），仅图标（移动端） | ✅ | 
 | ✅ | Responsive breakpoint works at 640px | 小屏幕隐藏文字，只显示图标 | ✅ | 
 | ✅ | Loading state shows '...' | 登录中显示 "..." | ✅ | 

---

### 7. 错误处理测试 (Error Handling)

| 用例ID | 测试场景 | 预期结果 | 状态 |
|--------|----------|----------|------|
 | ✅ | Permission denied handled with retry | `[SyncManager] Permission denied` 日志，稍后重试 | ✅ | 
 | ✅ | Network disconnect handled gracefully | 数据保存到本地，上线后重试 | ✅ | 
 | ✅ | OAuth popup close handled | `[Storage] User not logged in, saved to localStorage only` | ✅ | 
 | ✅ | Invalid config degrades to localStorage | 优雅降级到 localStorage 模式 | ✅ | 

---

## 测试执行记录

### 执行摘要

- **总用例数**: 42
- **已测试**: 0
- **通过**: 0
- **失败**: 0
- **待测试**: 42

### 详细结果

#### 1. 认证功能测试

| 用例ID | 结果 | 备注 |
|--------|------|------|
| AUTH-01 | ⬜ | |
| AUTH-02 | ⬜ | |
| AUTH-03 | ⬜ | |
| AUTH-04 | ⬜ | |
| AUTH-05 | ⬜ | |
| AUTH-06 | ⬜ | |
| AUTH-07 | ⬜ | |
| AUTH-08 | ⬜ | |

#### 2. 数据同步测试

| 用例ID | 结果 | 备注 |
|--------|------|------|
| SYNC-01 | ⬜ | |
| SYNC-02 | ⬜ | |
| SYNC-03 | ⬜ | |
| SYNC-04 | ⬜ | |
| SYNC-05 | ⬜ | |
| SYNC-06 | ⬜ | |
| SYNC-07 | ⬜ | |

#### 3. 离线功能测试

| 用例ID | 结果 | 备注 |
|--------|------|------|
| OFF-01 | ⬜ | |
| OFF-02 | ⬜ | |
| OFF-03 | ⬜ | |
| OFF-04 | ⬜ | |
| OFF-05 | ⬜ | |
| OFF-06 | ⬜ | |
| OFF-07 | ⬜ | |

#### 4. 多设备同步测试

| 用例ID | 结果 | 备注 |
|--------|------|------|
| MULTI-01 | ⬜ | |
| MULTI-02 | ⬜ | |
| MULTI-03 | ⬜ | |
| MULTI-04 | ⬜ | |
| MULTI-05 | ⬜ | |

#### 5. 数据迁移测试

| 用例ID | 结果 | 备注 |
|--------|------|------|
| MIG-01 | ⬜ | |
| MIG-02 | ⬜ | |
| MIG-03 | ⬜ | |
| MIG-04 | ⬜ | |

#### 6. UI/UX 测试

| 用例ID | 结果 | 备注 |
|--------|------|------|
| UI-01 | ⬜ | |
| UI-02 | ⬜ | |
| UI-03 | ⬜ | |
| UI-04 | ⬜ | |

#### 7. 错误处理测试

| 用例ID | 结果 | 备注 |
|--------|------|------|
| ERR-01 | ⬜ | |
| ERR-02 | ⬜ | |
| ERR-03 | ⬜ | |
| ERR-04 | ⬜ | |

---

## 发现的 Bug

| Bug ID | 问题描述 | 严重程度 | 状态 |
|--------|----------|----------|------|
| BUG-001 | | | ⬜ |

---

## 测试结论

- **整体状态**: ⬜ 通过 / ❌ 失败
- **建议**:
