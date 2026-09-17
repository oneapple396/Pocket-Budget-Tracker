# Pocket

Live website: https://pocket-money-student-tracker.oneapple396.chatgpt.site/

A student budget tracker made with HTML, CSS, and JavaScript only. No libraries, frameworks, accounts, or installation are required.

Quick entry: tap Log spending, enter an amount, and save. The note is optional and the date defaults to today; expand “Today · change date” for older purchases. Undo reverses the latest saved form action until another action or a reload.

Multiple goals: New goal needs only a name and target. Every goal has separate progress and Add / Take out actions requiring only an amount. Existing single-goal savings migrate automatically. Money moved between spending and goals stays part of the same total cash.

Open `dist/index.html` in a modern browser. Complete the setup survey using your real money, then log money received and spent. You can log a weekly total instead of individual purchases.

Upcoming holds back all listed unpaid costs from available money. Marking a cost paid records the expense; recurring costs advance to their next date. Savings transfers move money between spending and savings without changing your total. Expected allowance is counted only when you confirm it arrived.

Amounts are in US dollars. Data is saved in this browser, on this device; clearing browser storage removes it. Opening the app at a different address or in another browser uses separate storage. This app does not connect to bank accounts or make payments.

Files: `dist/index.html` (page), `dist/style.css` (styles), `dist/app.js` (budget logic), `dist/tutorial.js` (interactive tutorial), `dist/security.js` (saved-data validation), and `dist/privacy.js` (storage controls). Browser agent access is disabled.

Privacy: budget information stays in browser storage and is not encrypted. Use the Privacy controls to disable saving or clear your budget. No bank connection or account sign-in is required.



Security maintenance: after editing browser JavaScript or CSS, run node tools/update-integrity.cjs from this folder, then node tools/security-test.cjs before publishing. Script hashes in the content policy allow only the exact shipped scripts. Integrity checks also cover the stylesheet. These controls do not encrypt browser data or protect against a compromised device or replacement of the entire website.

