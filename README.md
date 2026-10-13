# The Reading Room — Library Desk

A friendly browser-based library manager. It grows the original project’s book registration, listing, code lookup, and year sorting into a complete desk for books, readers, checkouts, and returns.

The original C++ console program is preserved in [`legacy-console/`](legacy-console/) on the repository’s main branch.

## Technology

- **HTML5** provides the pages, forms, tables, and accessible controls.
- **CSS3** provides the responsive layout and reading-room visual style.
- **Vanilla JavaScript** handles the catalog, member directory, checkouts, returns, search, filters, and validation.
- **Browser local storage** saves changes in the current browser profile. There is no server-side database, account, build step, or package to install.

The app runs as a static site. Its core functionality works offline once the files are on your computer.

## Start using it

1. Open the project folder.
2. Double-click `index.html` to open The Reading Room in a current browser.
3. For the most reliable saving across refreshes, use the optional local server below and keep using the same browser and address.

### Optional local server

Open PowerShell in the project folder and run:

```powershell
python -m http.server 8000
```

If `python` is not recognized, try `py -m http.server 8000`. Then open [http://localhost:8000](http://localhost:8000). Keep the PowerShell window open while using the app; press `Ctrl+C` there to stop the server.

## How to use the library desk

- **Overview:** check total books, members, active loans, and overdue books at a glance.
- **Book catalog:** search by title, author, genre, or publisher; filter by availability; sort by title, author, or publication year; add, edit, check out, return, or remove books.
- **Loans:** check out an available book to a member with a due date; return it when it comes back; filter loan history by current, overdue, and returned items.
- **Members:** add readers, update their details, and search the directory. The app prevents removing a reader who still has a book checked out.
- **Backup:** click the download-arrow button in the top bar to save the current catalog, members, and loan history as `reading-room-backup.json`.
- **Restore sample data:** use **Restore demo data** at the bottom of a page to return the browser to the original example collection. This replaces the current local data after confirmation.

The initial demo has 8 sample books, 5 readers, 4 active checkouts, and 1 overdue book. Records are saved only in the current browser profile; they are not shared between computers or users. Download a backup before changing browsers or clearing browser data.

## Test the app

Follow [`TESTING.md`](TESTING.md) for a step-by-step walkthrough of the main flows, validation, overdue status, backups, persistence, keyboard behavior, and mobile layout.

