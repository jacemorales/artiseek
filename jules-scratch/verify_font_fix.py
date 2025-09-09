import os
from playwright.sync_api import sync_playwright

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 375, 'height': 667})
    page = context.new_page()

    base_path = os.path.abspath('crypto_brokerage')
    learn_path = f'file://{os.path.join(base_path, "learn.html")}'

    page.goto(learn_path)

    # Check H1 font size
    h1_font_size_str = page.locator('.learn-hero h1').evaluate("el => window.getComputedStyle(el).fontSize")
    h1_font_size = float(h1_font_size_str.replace('px', ''))
    assert h1_font_size < 40, f"H1 font size is too large: {h1_font_size}px"

    # Check H2 font size
    h2_font_size_str = page.locator('.learn-content h2').first.evaluate("el => window.getComputedStyle(el).fontSize")
    h2_font_size = float(h2_font_size_str.replace('px', ''))
    assert h2_font_size < 30, f"H2 font size is too large: {h2_font_size}px" # 1.6rem = 25.6px

    browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)

print("Final font size verification successful.")
