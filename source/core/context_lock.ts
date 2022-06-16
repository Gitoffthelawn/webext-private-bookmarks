import { browser } from "webextension-polyfill-ts";

import { bookmarks_locked, lock_bookmarks } from "./bookmarks";
import { add_message_listener } from "./messages";
import { options } from "./options";
import { add_listener_safely, remove_listener_safely } from "./utilities";

async function lock_bookmarks_if_not_private() {
    const has_private_context = (
        await browser.windows.getAll({ windowTypes: ["normal", "popup"] })
    ).some(window => window.incognito);

    if (!has_private_context) {
        await lock_bookmarks();
    }
}

function enable_context_lock() {
    add_listener_safely(browser.windows.onRemoved, lock_bookmarks_if_not_private);
}

function disable_context_lock() {
    remove_listener_safely(browser.windows.onRemoved, lock_bookmarks_if_not_private);
}

export function manage_context_lock(): void {
    add_message_listener(async message => {
        const { limit_to_private_context } = await options();

        if (message.kind === "options-change") {
            if (!limit_to_private_context) {
                disable_context_lock();
            } else {
                await lock_bookmarks_if_not_private();
                if (!(await bookmarks_locked())) {
                    enable_context_lock();
                }
            }
        } else if (message.kind === "lock-status-change") {
            if (await bookmarks_locked()) {
                disable_context_lock();
            } else if (limit_to_private_context) {
                enable_context_lock();
            }
        }
    });
}
