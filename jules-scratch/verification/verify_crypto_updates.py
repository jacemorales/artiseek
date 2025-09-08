import os
import re
from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 375, 'height': 667}) # Mobile viewport
    page = context.new_page()

    base_path = os.path.abspath('crypto_brokerage')
    index_path = f'file://{os.path.join(base_path, "index.html")}'
    learn_path_regex = re.compile(r".*learn\.html")

    # 1. Navigate to home page and check nav changes
    page.goto(index_path)
    expect(page.locator('.hamburger')).to_be_visible()
    expect(page.locator('.nav-links li a[href*="contact"]')).to_have_count(0)

    # 2. Open mobile menu and take screenshot
    page.locator('.hamburger').click()
    nav_links = page.locator('.nav-links')
    expect(nav_links).to_have_class(re.compile(r".*active"))
    # Wait for the link inside the menu to be visible to ensure menu is rendered
    expect(page.get_by_role("link", name="Learn")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/crypto_mobile_menu.png")

    # 3. Click 'Learn' link and verify navigation
    learn_link = page.get_by_role("link", name="Learn")
    learn_link.click()
    expect(page).to_have_url(learn_path_regex)
    expect(page.locator('.learn-hero h1')).to_have_text("Learn the Basics of Cryptocurrency")
    page.screenshot(path="jules-scratch/verification/crypto_learn_page.png")

    # 4. Go back and verify modal
    page.goto(index_path)
    expect(page.locator('.crypto-card').first).to_be_visible(timeout=15000)
    page.locator('.btn-invest').first.click()
    modal = page.locator('#invest-modal')
    expect(modal).to_be_visible()

    # Take screenshot of the modal
    page.screenshot(path="jules-scratch/verification/crypto_modal_fixed.png")

    browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)

print("Verification script for crypto updates executed successfully.")
