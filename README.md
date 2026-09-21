# Tab Saver

A privacy-first Manifest V3 browser extension for saving, searching, restoring, renaming, exporting, and importing tab sessions without a cloud account.

> **Status:** functional v1.0.0 for Chromium-based browsers. All session data stays in browser local storage unless you explicitly export a JSON backup.

## English

### Why it exists

Large browsing sessions are easy to lose and hard to revisit. Tab Saver turns the tabs in one browser window into a named local session that can be searched and restored later, without sending browsing history to a server.

### Features

- Save all normal HTTP/HTTPS tabs from the current window.
- Automatically remove duplicate URLs within a saved session.
- Preserve pinned-tab state and restore it in a new window.
- Search across session names, page titles, and URLs.
- Rename and delete saved sessions.
- Export all sessions to a versioned JSON backup.
- Import validated backups and safely preserve sessions on ID collisions.
- Reject internal/unsafe URL schemes such as `chrome:`, `file:`, and `javascript:`.
- 5 MB import limit to avoid accidentally loading very large files.
- Keyboard shortcut: `Ctrl+Shift+S` (`Command+Shift+S` on macOS) saves the current window.
- No analytics, network API, account, runtime package, or build step.
- Light/dark UI following the operating-system preference.

### Requirements

- A current Chromium-based browser supporting Manifest V3 (Chrome, Edge, Brave, or similar).
- Node.js 20+ only if you want to run the automated tests; Node is not required to use the extension.

### Installation

1. Clone or download this repository.
2. Open the browser's extensions page (`chrome://extensions` in Chrome or `edge://extensions` in Edge).
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select this repository's root directory (the directory containing `manifest.json`).
5. Pin **Tab Saver** to the toolbar if desired.

No `npm install` is needed.

### Usage

Open the extension and select **Save window**. The popup lists saved sessions. Use **Restore** to open a session in a new window, **Rename** to change its label, or **Delete** to remove it. The search field filters immediately.

Use **Export JSON** to create a portable backup. Use **Import JSON** to merge a valid Tab Saver backup into local storage. Imported content is sanitized before it is saved.

### Configuration

There are no environment variables, API keys, or external services. The extension uses two browser permissions:

- `tabs` — read the current window's tab titles/URLs and restore pinned state.
- `storage` — persist sessions locally in the browser profile.

The keyboard shortcut can be changed from the browser's extension shortcuts page.

### Preview / screenshots

After loading the unpacked extension, save a small window and capture the popup in both light and dark system modes. Screenshots are intentionally not committed until they represent a real browser run; the repository does not use mock screenshots.

### Project structure

```text
manifest.json              Extension manifest and permissions
src/core.js                Pure validation/session/import-export logic
src/background.js          Keyboard-command session capture
src/popup.html             Popup markup
src/popup.css              Responsive light/dark popup styling
src/popup.js               Browser UI and storage workflow
test/core.test.js          Node built-in unit tests
.github/workflows/ci.yml   Cross-platform syntax/tests CI
SECURITY.md                Security and privacy policy
CONTRIBUTING.md            Contribution guide
```

### Testing

```bash
npm run check
npm test
```

Tests use Node's built-in test runner and require no third-party dependencies. CI runs syntax checks and tests on Node 20 and 22 across Ubuntu, Windows, and macOS. Browser API flows should also be manually checked after loading the extension unpacked.

### Security & privacy

Tab Saver has no network code or telemetry. Only HTTP(S) URLs are accepted. Imported JSON is schema-checked, size-limited, and re-sanitized. Exported backups contain browsing URLs and titles, so treat them as private data. Browser `storage.local` is **not encrypted storage** and should not be treated as a secrets vault. See [SECURITY.md](SECURITY.md).

### Limitations

- Chromium Manifest V3 is the supported target; Firefox-specific packaging is not provided yet.
- Sessions are local to one browser profile unless exported/imported manually.
- The extension saves normal HTTP(S) pages only; browser internal pages cannot be captured/restored.
- There is no cloud sync, automatic periodic snapshot, cross-device account, tab-group preservation, or encrypted backup.
- The UI is English in v1; this README is bilingual.

### Optional roadmap

Potential future work includes tab-group preservation, optional encrypted backup files, Firefox packaging, and UI localization. These are not claimed as current features.

### Contributing & license

See [CONTRIBUTING.md](CONTRIBUTING.md). Released under the [MIT License](LICENSE).

### Author

**Radwan Abdulhadi Ahmed**  
**رضوان عبدالهادي أحمد**  
GitHub: **@rad03i2**

---

## العربية

### نظرة عامة

**Tab Saver** إضافة متصفح محلية مبنية على Manifest V3 لحفظ جلسات علامات التبويب والبحث فيها واستعادتها وتسميتها وتصديرها واستيرادها، من دون حساب سحابي أو إرسال سجل التصفح إلى خادم خارجي.

### لماذا المشروع؟

عند العمل على عدد كبير من علامات التبويب يصبح الرجوع إلى جلسة سابقة أمرًا صعبًا. تحفظ الأداة علامات تبويب النافذة الحالية كجلسة محلية يمكن البحث عنها واستعادتها لاحقًا، مع إبقاء البيانات داخل ملف المتصفح.

### الميزات

- حفظ صفحات HTTP/HTTPS الموجودة في النافذة الحالية.
- إزالة الروابط المكررة داخل الجلسة تلقائيًا.
- حفظ حالة التثبيت Pinned وإعادتها عند الاستعادة.
- البحث في اسم الجلسة وعناوين الصفحات والروابط.
- إعادة تسمية الجلسات وحذفها.
- تصدير جميع الجلسات إلى نسخة JSON ذات إصدار بنية واضح.
- استيراد النسخ الاحتياطية بعد التحقق منها وتنظيف الروابط.
- رفض مخططات الروابط الداخلية أو غير الآمنة مثل `chrome:` و`file:` و`javascript:`.
- حد أقصى 5 ميغابايت لملف الاستيراد.
- اختصار `Ctrl+Shift+S`، وعلى macOS الاختصار `Command+Shift+S`، لحفظ النافذة الحالية.
- لا توجد تحليلات أو اتصالات شبكية أو حسابات أو حزم تشغيل خارجية.
- واجهة فاتحة/داكنة تتبع إعداد النظام.

### المتطلبات والتثبيت

تحتاج إلى متصفح حديث مبني على Chromium مثل Chrome أو Edge أو Brave. لاستخدام الإضافة، افتح صفحة الإضافات في المتصفح، فعّل **وضع المطور**، اختر **تحميل إضافة غير محزّمة / Load unpacked**، ثم اختر مجلد المشروع الذي يحتوي على `manifest.json`.

Node.js 20 أو أحدث مطلوب فقط لتشغيل الاختبارات، وليس لتشغيل الإضافة. لا تحتاج إلى تنفيذ `npm install`.

### الاستخدام

افتح الإضافة واضغط **Save window** لحفظ النافذة. استخدم **Restore** لفتح الجلسة في نافذة جديدة، و**Rename** لتغيير الاسم، و**Delete** للحذف. حقل البحث يرشح النتائج مباشرة.

زر **Export JSON** ينشئ نسخة احتياطية، وزر **Import JSON** يدمج نسخة Tab Saver صحيحة مع البيانات الحالية بعد التحقق والتنظيف.

### الإعداد

لا توجد متغيرات بيئة أو مفاتيح API. الصلاحيتان المستخدمتان هما `tabs` لقراءة علامات النافذة واستعادة حالة التثبيت، و`storage` لحفظ الجلسات محليًا. يمكن تغيير اختصار لوحة المفاتيح من صفحة اختصارات الإضافات في المتصفح.

### المعاينة والصور

بعد تحميل الإضافة فعليًا، احفظ نافذة صغيرة ثم التقط صورة للنافذة المنبثقة في الوضع الفاتح أو الداكن. لا يتضمن المستودع صورًا وهمية؛ يفضّل إضافة صور مأخوذة من تشغيل حقيقي فقط.

### بنية المشروع

`src/core.js` يحتوي المنطق القابل للاختبار، و`src/background.js` يعالج اختصار لوحة المفاتيح، وملفات `popup` تشكل الواجهة وتدفق التخزين، بينما تغطي `test/core.test.js` منطق التحقق والاستيراد والتصدير والبحث.

### الاختبارات

```bash
npm run check
npm test
```

تستخدم الاختبارات الأدوات المدمجة في Node فقط. كما يفحص CI المشروع على Node 20 و22 في Ubuntu وWindows وmacOS. تبقى تجربة تدفقات Browser API يدويًا بعد تحميل الإضافة خطوة مهمة قبل إصدار متجر رسمي.

### الخصوصية والأمان

لا تحتوي الإضافة على شبكة أو Telemetry. تُقبل روابط HTTP(S) فقط، ويُتحقق من النسخ المستوردة ويعاد تنظيفها. ملف JSON المصدّر قد يحتوي سجل تصفح حساسًا، لذلك يجب حفظه ومشاركته بحذر. تخزين المتصفح المحلي **ليس تشفيرًا** ولا ينبغي اعتباره خزنة أسرار. راجع [SECURITY.md](SECURITY.md).

### القيود

الدعم الحالي موجه لمتصفحات Chromium، ولا توجد حزمة Firefox مستقلة. المزامنة بين الأجهزة يدوية عبر التصدير والاستيراد. صفحات المتصفح الداخلية لا تُحفظ. لا توجد مزامنة سحابية أو لقطات دورية أو حفظ لمجموعات التبويب أو نسخ احتياطية مشفرة حاليًا.

### تطوير اختياري مستقبلي

يمكن مستقبلًا إضافة حفظ مجموعات التبويب، ونسخ احتياطية مشفرة اختيارية، وحزمة Firefox، وترجمة واجهة المستخدم. هذه أفكار مستقبلية وليست ميزات منفذة حاليًا.

### المساهمة والترخيص

راجع [CONTRIBUTING.md](CONTRIBUTING.md). المشروع متاح بترخيص [MIT](LICENSE).

### المؤلف

**Radwan Abdulhadi Ahmed**  
**رضوان عبدالهادي أحمد**  
GitHub: **@rad03i2**
