import os
import re
from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})

    base_path = os.path.abspath('real_estate_brokerage')
    index_path = f'file://{os.path.join(base_path, "index.html")}'

    # 1. Navigate to home page and take screenshot of new design
    page.goto(index_path)
    # The Unsplash images might take a moment to load
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000) # Wait for animations
    page.screenshot(path="jules-scratch/verification/real_estate_v2_home.png")

    # 2. Switch to mobile and verify mobile menu
    page.set_viewport_size({'width': 375, 'height': 667})
    page.locator('.hamburger').click()
    # Use a more direct assertion to check if the class is added
    expect(page.locator('.nav-links')).to_have_class(re.compile(r".*active"))
    page.screenshot(path="jules-scratch/verification/real_estate_v2_mobile_menu.png")

    browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)

print("Final verification script (v2) for Real Estate website executed successfully.")
