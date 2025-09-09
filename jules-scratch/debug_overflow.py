import os
from playwright.sync_api import sync_playwright

def debug_overflow(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 375, 'height': 667})
    page = context.new_page()

    base_path = os.path.abspath('crypto_brokerage')
    index_path = f'file://{os.path.join(base_path, "index.html")}'
    page.goto(index_path)

    # Use evaluate to find oversized elements
    oversized_elements = page.evaluate("""() => {
        const elements = document.querySelectorAll('*');
        const oversized = [];
        const viewportWidth = window.innerWidth;
        elements.forEach(el => {
            if (el.scrollWidth > viewportWidth) {
                oversized.push({
                    tagName: el.tagName,
                    className: el.className,
                    id: el.id,
                    scrollWidth: el.scrollWidth
                });
            }
        });
        return oversized;
    }""")

    if oversized_elements:
        print("Found oversized elements:")
        for el in oversized_elements:
            print(f"- Tag: {el['tagName']}, Class: '{el['className']}', ID: '{el['id']}', Width: {el['scrollWidth']}px")
    else:
        print("No oversized elements found.")

    browser.close()

with sync_playwright() as playwright:
    debug_overflow(playwright)
