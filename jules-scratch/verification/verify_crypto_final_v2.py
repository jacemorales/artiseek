import os
import re
from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 375, 'height': 667}) # Mobile viewport
    page = context.new_page()

    base_path = os.path.abspath('crypto_brokerage')
    index_path = f'file://{os.path.join(base_path, "index.html")}'

    # 1. Verify mobile nav is not causing overflow
    page.goto(index_path)

    # Check that body does not have a horizontal scrollbar
    body_width = page.evaluate("document.body.scrollWidth")
    viewport_width = page.viewport_size['width']
    assert body_width <= viewport_width, f"Body width ({body_width}) is greater than viewport width ({viewport_width}), causing overflow."

    page.screenshot(path="jules-scratch/verification/crypto_v2_home_mobile.png")

    # 2. Verify modal is mobile-friendly
    expect(page.locator('.crypto-card').first).to_be_visible(timeout=15000)
    page.locator('.btn-invest').first.click()
    modal = page.locator('#invest-modal')
    expect(modal).to_be_visible()
    page.screenshot(path="jules-scratch/verification/crypto_v2_modal_mobile.png")

    browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)

print("Final verification script (v2) for Crypto website executed successfully.")
