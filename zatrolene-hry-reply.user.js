// ==UserScript==
// @name         Zatrolené Hry - Odpovědět na příspěvek
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds "Odpovědět" option to comment actions menu with quoted reply
// @author       You
// @match        https://www.zatrolene-hry.cz/diskuse/*
// @match        https://www.zatrolene-hry.cz/*/otazky/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to truncate text to max 2 lines (approximately 150 chars)
    function truncateText(text, maxLength = 150) {
        text = text.trim();
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength).trim() + '…';
    }

    // Function to extract plain text from HTML element
    function getPlainText(element) {
        // Clone the element to avoid modifying the original
        const clone = element.cloneNode(true);

        // Remove any existing quote replies (nested quotes)
        const existingQuotes = clone.querySelectorAll('i');
        existingQuotes.forEach(q => {
            if (q.textContent.includes('↪')) {
                q.remove();
            }
        });

        return clone.textContent.trim();
    }

    // Function to create reply with quote
    function createReply(commentElement) {
        // Find the username
        const usernameLink = commentElement.querySelector('.username a');
        if (!usernameLink) {
            console.error('Username not found');
            return;
        }

        const username = usernameLink.textContent.trim();
        const userMention = usernameLink.getAttribute('href').match(/\/uzivatel\/[^/]+/)[0];
        const userId = userMention.match(/-(\d+)/)[1];

        let commentText = '';

        // Check if there's a text selection
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        // If there's selected text, check if it's within this comment
        if (selectedText.length > 0) {
            // Check if the selection is within the current comment element
            const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
            if (range && commentElement.contains(range.commonAncestorContainer)) {
                // Use the selected text
                commentText = selectedText;
                console.log('Using selected text:', commentText);
            }
        }

        // If no selection or selection is not in this comment, use the comment text
        if (commentText.length === 0) {
            // Find the comment text
            const contentDiv = commentElement.querySelector('.flex-grow-1');

            // Get all paragraphs and find the first one with actual content
            // (browsers auto-correct nested <p> tags which can create empty ones)
            const paragraphs = contentDiv.querySelectorAll('p');
            let commentParagraph = null;

            for (let p of paragraphs) {
                const text = getPlainText(p);
                if (text.length > 0) {
                    commentParagraph = p;
                    break;
                }
            }

            if (!commentParagraph) {
                console.error('Comment text not found');
                return;
            }

            commentText = getPlainText(commentParagraph);
        }

        const truncatedText = truncateText(commentText);

        // Create the quote text in the format shown in examples
        const quoteText = `<p><i>↪ <a class="mention" data-mention="@${userId}" data-type="user" href="${userMention}/">@${username}</a>  : »${truncatedText}«</i></p><p>&nbsp;</p>`;

        // Click the "Přidat příspěvek" button
        const addButton = document.querySelector('a.bs-modal[href*="/dialog/comments-form"]');
        if (!addButton) {
            console.error('Přidat příspěvek button not found');
            return;
        }

        // Store the quote text for when the modal loads
        window.pendingReplyText = quoteText;

        // Click the button
        addButton.click();

        // Wait for the modal and CKEditor to load
        let attempts = 0;
        const maxAttempts = 100; // 10 seconds
        const checkInterval = setInterval(() => {
            attempts++;

            // Look for CKEditor instance in multiple ways
            let editor = null;

            // Method 1: Check for global ckeditorInstance
            if (window.ckeditorInstance) {
                editor = window.ckeditorInstance;
            }

            // Method 2: Check for editor in DOM elements
            if (!editor) {
                const editableElements = document.querySelectorAll('.ck-editor__editable');
                editableElements.forEach(el => {
                    if (el.ckeditorInstance) {
                        editor = el.ckeditorInstance;
                        window.ckeditorInstance = editor;
                    }
                });
            }

            // Method 3: Look for textarea and find its CKEditor instance
            if (!editor) {
                const modal = document.querySelector('#bsModal.show');
                if (modal) {
                    const textareas = modal.querySelectorAll('textarea');
                    textareas.forEach(textarea => {
                        if (textarea.nextElementSibling && textarea.nextElementSibling.classList.contains('ck-editor')) {
                            const editable = textarea.nextElementSibling.querySelector('.ck-editor__editable');
                            if (editable && editable.ckeditorInstance) {
                                editor = editable.ckeditorInstance;
                                window.ckeditorInstance = editor;
                            }
                        }
                    });
                }
            }

            // If we found an editor and have pending text
            if (editor && window.pendingReplyText) {
                try {
                    // Set the data with the quote
                    editor.setData(window.pendingReplyText);

                    // Clear the pending text
                    const textToInsert = window.pendingReplyText;
                    delete window.pendingReplyText;

                    // Clear the interval
                    clearInterval(checkInterval);

                    // Focus the editor at the end
                    setTimeout(() => {
                        editor.editing.view.focus();
                        // Move cursor to the end
                        editor.model.change(writer => {
                            writer.setSelection(editor.model.document.getRoot(), 'end');
                        });
                    }, 100);

                    console.log('Reply quote inserted successfully');
                } catch (error) {
                    console.error('Error inserting quote:', error);
                }
            }

            // Stop after max attempts
            if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                delete window.pendingReplyText;
                console.warn('CKEditor not found after 10 seconds');
            }
        }, 100);
    }

    // Function to add "Odpovědět" to dropdown menus
    function addReplyButtons() {
        // Find all comment blocks
        const comments = document.querySelectorAll('.list-item');

        comments.forEach(comment => {
            // Check if we already added the reply button
            if (comment.dataset.replyAdded) {
                return;
            }

            // Find the dropdown menu
            const dropdownMenu = comment.querySelector('.dropdown-menu');
            if (!dropdownMenu) {
                return;
            }

            // Create the "Odpovědět" menu item
            const replyItem = document.createElement('li');
            const replyLink = document.createElement('a');
            replyLink.className = 'dropdown-item';
            replyLink.href = '#';
            replyLink.innerHTML = '<i class="fa-solid fa-reply"></i> Odpovědět';

            // Add click handler
            replyLink.addEventListener('click', (e) => {
                e.preventDefault();
                createReply(comment);
            });

            replyItem.appendChild(replyLink);

            // Insert at the beginning of the menu (after any existing items)
            if (dropdownMenu.children.length > 0) {
                dropdownMenu.insertBefore(replyItem, dropdownMenu.firstChild);

                // Add a divider after the reply button
                const divider = document.createElement('li');
                divider.innerHTML = '<hr class="dropdown-divider">';
                dropdownMenu.insertBefore(divider, replyItem.nextSibling);
            } else {
                dropdownMenu.appendChild(replyItem);
            }

            // Mark as processed
            comment.dataset.replyAdded = 'true';
        });
    }

    // Intercept CKEditor creation to save reference
    const originalInit = window.ClassicEditor?.create;
    if (window.ClassicEditor) {
        window.ClassicEditor.create = function(...args) {
            return originalInit.apply(this, args).then(editor => {
                window.ckeditorInstance = editor;
                return editor;
            });
        };
    }

    // Run on page load
    addReplyButtons();

    // Watch for dynamic content changes (in case comments are loaded dynamically)
    const observer = new MutationObserver((mutations) => {
        addReplyButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
