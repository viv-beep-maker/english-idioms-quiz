# Between Words — Curated by Vivien

An offline classroom presentation app for adult English learners. No account, subscription, internet connection, or installation is required.

## Open it on Windows

1. Download this repository (on GitHub: **Code → Download ZIP**).
2. Right-click the ZIP file and choose **Extract All**.
3. Open the extracted folder. Keep `index.html`, `styles.css`, `starter-data.js`, `more-topics.js`, `lesson-support.js`, `illustration-art.js`, `quiz-store.js`, `app.js`, `teacher.html`, and `editor.js` together, along with the complete `assets` folder.
4. **Double-click `index.html`.** It opens in your default browser. Microsoft Edge or Google Chrome is recommended. If needed, right-click it → **Open with → Microsoft Edge**.

You do not need a terminal or any commands. On tablets, use a browser that supports opening local HTML files; alternatively, serve this folder using any ordinary static web server.

## Present a lesson

- Topics appear as a compact, numbered single-column list, capped at 800px on desktop, with equal-height Start Quiz buttons aligned on the right. The outlined teal buttons use 13px Regular text so the topic names stay prominent. The rows adapt to phones without stacking the buttons below the titles. Everyday Life is set 1, Workplace Idioms is set 2, and Competition & Winning is set 3. On desktop, the header and footer place **Curated by Vivien** to the right of **Between Words**, with **Where language meets conversation.** underneath the brand name, alongside the existing V and speech-bubble artwork. On mobile, the curator credit appears only in the footer to keep the header simple. The hero keeps its headline without repeating the tagline, followed by **B1–B2 · Intermediate to Upper-Intermediate**, and the topic section is titled **Explore idioms by topic.** On desktop, the footer email aligns on the same text baseline as the tagline on the left. The footer includes the inquiries/feedback email englishwithvivien@outlook.com and **© 2026 Between Words. All rights reserved.** The same symbol is the browser tab icon, with a mint-and-cream interface. Typography uses three self-hosted families: **Newsreader** for the Between Words wordmarks and home hero headline; **Inter** for navigation, buttons, supporting brand text, other English headings, questions, answers, definitions, examples, discussion and editor text; **Pretendard** for Korean translations and other Hangul text. Reusable CSS variables are `--font-display`, `--font-english`, and `--font-korean`. Hangul-only font coverage lets mixed sentences use Newsreader for display text, Inter for supporting English, and Pretendard for Korean. The wordmark uses Newsreader Medium (500) in roman style; the hero uses Newsreader Semibold (600) with automatic optical sizing. The two-line hero uses 38px type on desktop and 29px on mobile, with 1.15 line height; the wordmark keeps its existing size. Regular (400), Medium (500), Semibold (600) and Bold (700) provide emphasis. Fonts load locally as WOFF2 with `font-display: swap`; visitors need no font installation or external font service. The illustrated V logo is unchanged image artwork; live wordmarks use the display font and their supporting text uses Inter.
- On Home, choose **Start Quiz** for a topic. Questions are automatically shuffled every time you start a topic. There is no shuffle checkbox. Answer choices keep their A–D order.
- Shuffling applies only to that quiz session; it never changes the saved editor order. Previous/Next follow the chosen order, and Restart keeps it. Return Home and start any topic again to get a fresh shuffle.
- Each question shows one small landscape picture clue based on an example situation. It is a compact, muted editorial illustration with one contextual idea and no written answer hint. It suggests the situation instead of drawing literal idiom wordplay. Review questions for the same expression share its clue.
- Read the question and discuss the four answers. Click any answer to check it: correct choices turn green and show “CORRECT”; incorrect choices turn red and show “INCORRECT”. There is no additional feedback sentence below the answers. You can try another choice. No scores are recorded. Answer choices also work with Tab followed by Enter or Space.
- Select **Reveal Answer** to highlight the correct answer and show its definition, Korean meaning, and two English examples, each starting with **e.g.** on its own line (no bullets). **Hide Answer** conceals them again.
- After revealing, **Let’s talk about it** provides three discussion questions for the expression: personal experience, a practical speaking situation, and an opinion. Invite learners to use the target expression in each answer. Learners may invent an example instead of sharing private experiences. Hide Answer hides the discussion too.
- Use **Previous** and **Next Question**. Moving between questions always clears the selected answer and hides the explanation again. Hide Answer also clears the selection for a fresh discussion.
- The final question has **Finish Quiz**, followed by an end screen where you can revisit the last question, restart, or return home.
- **Restart quiz** asks for confirmation.
- The public header has no Home or Fullscreen buttons. Click the brand to return to the topic menu. Use **F** to toggle fullscreen, or **F11** on Windows; **Esc** exits browser fullscreen.
- Keyboard: **← / →** move between questions; **Space** reveals/hides the answer; **F** toggles fullscreen. Shortcuts pause when typing or editing. Space activates a focused button normally; click the question background to use Space for reveal again.

## Responsive type and spacing

`styles.css` centralizes sizes as `--size-page`, `--size-section`, `--size-idiom`, `--size-body`, `--size-detail`, and `--size-secondary`. At 750px and below, page titles switch from 28px to 23px, section headings from 18px to 17px, expression titles from 17px to 16px, and detailed discussion/help text from 14px to 13px. Definitions, examples and Korean translations stay at 14px; secondary text stays at 12px.

The mobile home hero uses a 29px Newsreader Semibold headline, with a plain 12px muted learning-level line beneath it. Topic titles are 16px, and compact menu rows have a 68px minimum height, 14px horizontal padding, and 12px gaps. Topic numbers become plain text on mobile; Start Quiz buttons use 13px Regular text and an 88 × 44px touch target. On desktop, the buttons are 96 × 44px; topic titles remain 16px. The home column is capped at 800px, while mobile uses the available width with 16px outer margins. The header tagline is 11px, and the 11px curator credit stays in the footer. Mobile uses 1.6 body line height; quiz question cards retain 16px side padding and 12px gaps between answer choices. The Reveal Answer button occupies its own row above Previous/Next. Interactive controls are at least 44px tall. Mobile form inputs use 16px text to avoid iOS focus zoom; this does not change the 14px reading size of translations and examples. Whole words wrap naturally with emergency wrapping for unusually long strings. The existing ivory, white, deep green, muted teal, and sage palette is reused consistently through CSS color variables, including borders, hover states, and keyboard focus. Existing correct/incorrect answer status colors remain intact.

## Edit questions without coding

The teacher page is a separate editing interface, not an authenticated administrator area. Anyone who knows its address can open it. Its `noindex` metadata requests that search engines not index it; this does not restrict access. Changes affect only the editing browser, not other visitors. Only people with repository write access can publish changes to the shared website. Do not treat the teacher URL as a password.

When using the hosted site, open the editor and quiz in the same browser/profile to preview your edits; they share the existing localStorage key, preserving earlier saves. **Open quiz** returns to the presentation page. To update the content for everyone, export JSON and have the content published through the GitHub repository; saving in the editor does not publish. Local `file://` storage can differ between files in some browsers, so use the hosted site for shared editor/quiz previews. Offline editing and JSON export still work without a server.

1. Open the separate **teacher.html** page directly. On the published site: https://viv-beep-maker.github.io/english-idioms-quiz/teacher.html — bookmark it. The public quiz has no editor menu, editor form, or editor script. For offline editing, open teacher.html from the extracted folder.
2. Choose a topic. Select **Edit** beside a question, or **Add question**.
3. Enter a question, four different answers, the correct answer letter, idiom, English definition, Korean meaning, and two English examples. The app automatically adds “e.g.” when displaying each example; you can enter it with or without that prefix.
4. Under **Picture clue & discussion**, choose one of the 87 built-in pictures that matches an example situation, and edit the three discussion prompts. Existing expressions come with tailored prompts; new custom expressions start with editable general prompts.
5. Select **Save question**. Changes are saved locally in this browser.
6. Use **Add topic** to create a new topic, then add its questions. Empty topics cannot start a quiz.
7. **Delete** asks for confirmation before removing a question.

Twelve starter topics contain 10 questions each (120 questions total): Competition & Winning; Workplace Idioms; Everyday Life; Money & Shopping; Feelings & Reactions; Friends & Relationships; Communication & Conversation; Time & Busy Lives; Decisions & Plans; Challenges & Resilience; Health, Energy & Rest; and Learning & Improving.

The ten additional topics each introduce seven common expressions, with seven situation questions and three meaning-review questions. Every expression includes a simple definition, Korean meaning, and two original example sentences based on realistic everyday situations. Some expressions are especially informal; they are suited to conversation rather than every formal document.

Older questions and imports without picture/discussion fields receive matching defaults by expression; existing custom picture selections and discussion prompts are preserved. All existing question text, answers, explanations, and examples remain editable. Imports with a picture must use a built-in clue ID, and supplied discussion lists must contain exactly three nonempty questions. Picture selections and discussion prompts travel with JSON backups. For custom examples, review the picture match in the editor.

When the app updates, existing browser saves receive missing topics from the new content release once, without replacing edited questions. Topics already using the same ID or name are preserved. Topics from older releases are not restored during later upgrades. At the 100-topic limit, a message explains why some topics could not be added. Imports deliberately replace the content exactly as supplied, and are not supplemented on the next reload. Teachers should review new questions to ensure only the selected answer is correct; the editor can check structure but cannot judge language accuracy.

## Back up and transfer your questions

- In Question editor, select **Export JSON** to download all topics and questions. Keep a backup after editing.
- On another computer, open **teacher.html**, then choose **Import JSON**, and choose your exported file.
- Import **replaces all topics and questions**, after confirmation. Export first if you need to preserve the current quiz.
- Invalid files produce a message without changing your quiz. Imports are limited to 5 MB, 100 topics, and 500 questions per topic. The version 1 format is demonstrated by exported files; `correct` uses 0–3 for A–D.

Local saves belong to your browser and file location, not to the source files. They do not sync. Moving/renaming the folder, switching browsers, private browsing, clearing browser data, or browser restrictions on local file storage may hide or remove them. **Export JSON is the reliable backup.** A storage error is shown when a change cannot be saved; the app does not pretend that it saved. If existing stored data cannot be read, starter content is shown without overwriting it. Keep your backup and try importing in a regular browser window with storage allowed.

## Project files

- `index.html`: public home and classroom presentation; no editor controls or forms.
- `teacher.html`: separate teacher workspace with the editor and question form.
- `quiz-store.js`: shared content validation, existing localStorage saves, and starter-content upgrades.
- `editor.js`: teacher-only editing, JSON import/export, and local saving; not loaded by the public quiz.
- `styles.css`: responsive mint-and-cream design with dark readable text.
- `starter-data.js`: the first 20 questions across two topics, with bilingual explanations.
- `more-topics.js`: ten more topics with 100 questions and bilingual explanations.
- `lesson-support.js`: expression mappings and 261 tailored discussion prompts for 87 expressions.
- `illustration-art.js`: mappings, accessible descriptions, and display coordinates for the 87 editorial clues.
- `assets/illustrations/`: original editorial illustrations in shared PNG sheets, plus one individual alternative. Only the matching illustration is visible for each question. No image service is contacted at runtime.
- `assets/fonts/`: Newsreader Roman, Inter, and Pretendard WOFF2 fonts, their SIL Open Font Licenses, and source/conversion checksums. Legacy DM Sans files remain for older cached pages and are not loaded by the current stylesheet.
- `assets/brand/`: the mint symbol and full approved logo; keep these with the project when running offline.
- `assets/clues/`: legacy SVG files retained for compatibility with already-open older pages; current questions use the editorial art.
- `app.js`: public quiz controls and presentation only.
- `README.md`: these instructions.

No build step or third-party runtime dependencies. Regular scripts (rather than modules or fetch) allow direct `file://` opening. No external fonts, images, APIs, or services are used.

For cloud development only, an optional static server is `python3 -m http.server 8000 --bind 127.0.0.1` from the project folder. The app itself does not require Python or a server.
