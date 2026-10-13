# The Reading Room — full test walkthrough

Use the sample data first. The dashboard should begin with **8 books**, **5 members**, **4 books on loan**, and **1 overdue book**. The overdue sample is *Pachinko*. Keep the browser on the same address and profile during the walkthrough.

## 1. Open the app and check the dashboard

1. Open `index.html` or start the optional local server from [README.md](README.md).
2. Confirm the page says “A good day to get lost in a book.” and the four counts are 8, 5, 4, and 1.
3. Confirm recent checkouts show book, reader, checkout date, due date, and status.
4. Click **Browse the catalog**. The catalog should show the sample books and their availability.

## 2. Search and sort the catalog

1. In **Book catalog**, search for `Pachinko`. One matching result should appear.
2. Search for a word that is not present, such as `moonstone`. The empty-search message should appear. Clear the search to restore the list.
3. Choose **Available** in the availability filter. *Pachinko* should disappear because it is on loan.
4. Choose **Sort: Newest first**. *The Creative Act* (2023) should appear before older books.
5. Search for `Robin Wall Kimmerer`; *Braiding Sweetgrass* should appear.

## 3. Add, edit, and remove a book

1. Click **Add a book** and enter title `Test Garden`, author `A. Reader`, genre `Fiction`, year `2024`, publisher `Sample Press`; save.
2. Confirm it appears in the catalog and the book count is now 9.
3. Try adding `Test Garden` again with a different author. The app should reject the duplicate title.
4. Click **Edit** on *Test Garden*, change its title to `Test Garden Revised`, and save. Search for the revised title to confirm the update.
5. Click **Delete** on the edited book and accept the confirmation. It should disappear and the count should return to 8.

## 4. Add and edit a member

1. Open **Members** and click **Add a member**.
2. Add `Jamie Reader` with `jamie.reader@example.com`. The directory count should increase from 5 to 6.
3. Try adding another member with the same email. The app should reject the duplicate email.
4. Edit Jamie’s details and change the name to `Jamie R. Reader`; save and confirm the card updates.
5. Remove Jamie after confirming. The directory returns to 5 members.

## 5. Check out and return a book

1. From the catalog, click **Check out** on *Braiding Sweetgrass*.
2. Choose Avery Chen and set the due date to a future date. Complete checkout.
3. Confirm the book changes to **Checked out**, the loan count increases from 4 to 5, and the member card reports one more book out.
4. Open **Loans**. The new row should show *Braiding Sweetgrass*, Avery Chen, and the due date.
5. Click **Return book** on that row. Confirm the row becomes **Returned**, the book becomes available again, and the loan count returns to 4.

## 6. Test overdue status and guardrails

1. Open **Loans** and choose the **Overdue** filter. *Pachinko* should be the one result.
2. Click **Return book** on *Pachinko*. It should become **Returned** and the overdue dashboard count should fall from 1 to 0.
3. In the catalog, find a checked-out title and try to remove it. The app should explain that it must be returned first.
4. In Members, find a member with an active loan and try to remove them. The app should ask for the book to be returned first.
5. Try a checkout due date of today or earlier. The form should prevent the invalid date.

## 7. Test loan filters and search

1. In Loans, click **On loan**. Only active loans should remain.
2. Search for a member name from the visible list. Matching loans should remain; unrelated loans should disappear.
3. Click **Returned**. Only completed loans should appear.
4. Clear the search and click **All loans** to restore the complete loan history.

## 8. Test global search and backup

1. Use the top search field to search `Creative Act`, then press **Enter**. The catalog should open with the matching book visible.
2. Search for `Sofia Almeida` and press **Enter**. The member directory should open with Sofia’s card visible.
3. Click the download-arrow button in the top bar. A file named `reading-room-backup.json` should download.
4. Open the backup in a text editor. It should contain `books`, `members`, and `loans` arrays, including your current data.

## 9. Verify saving and restore

1. Add a temporary book or member, then refresh the page. The added record should still be present.
2. Click **Restore demo data** at the bottom of the page and accept the confirmation.
3. Confirm the dashboard returns to 8 books, 5 members, 4 active loans, and 1 overdue loan. The temporary record should be gone.

## 10. Check layout and keyboard behavior

1. Widen the browser to desktop size, then narrow it to a phone-sized width. The sidebar should become a bottom navigation bar and cards should stack cleanly.
2. Use `Tab` to move through the controls. Focus should be visible.
3. Open an add form, press `Escape`, and confirm the dialog closes. Reopen it and use **Cancel** to confirm that path closes too.
4. Press `Ctrl+K` (or `⌘K` on macOS) to focus global search.

