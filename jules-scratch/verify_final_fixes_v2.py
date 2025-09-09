import os
import re
from playwright.sync_api import sync_playwright, expect

def run_final_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    base_path = os.path.abspath('crypto_brokerage')
    index_path = f'file://{os.path.join(base_path, "index.html")}'

    # --- Verify Crypto Site Fixes ---
    print("--- Verifying Final Crypto Fixes ---")
    page.goto(index_path)

    # Login
    page.locator('#start-investing-btn').click()
    page.locator('#email').fill('demo@example.com')
    page.locator('#password').fill('password123')
    page.locator('#login-form button').click()

    # Verify dashboard and new chart
    expect(page).to_have_url(re.compile(r".*dashboard\.html"))
    # Wait for chart to render
    expect(page.locator('.apexcharts-svg')).to_be_visible(timeout=15000)
    page.screenshot(path="jules-scratch/verification/final_chart.png")
    print("New chart rendered successfully.")

    # Verify modal placeholder
    page.locator('.btn-invest').first.click()
    invest_modal = page.locator('#invest-modal')
    expect(invest_modal).to_be_visible()
    placeholder = invest_modal.locator('#amount').get_attribute('placeholder')
    assert placeholder == "e.g., 500"
    page.screenshot(path="jules-scratch/verification/final_modal_with_placeholder.png")
    print("Modal placeholder is correct.")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run_final_verification(playwright)

print("\nAll final fixes verified successfully.")
