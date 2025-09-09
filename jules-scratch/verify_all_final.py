import os
import re
from playwright.sync_api import sync_playwright, expect

def run_final_verification(playwright):
    browser = playwright.chromium.launch(headless=True)

    # --- Verify Crypto Site ---
    print("--- Verifying Crypto Site ---")
    crypto_context = browser.new_context()
    crypto_page = crypto_context.new_page()
    crypto_base_path = os.path.abspath('crypto_brokerage')
    index_path = f'file://{os.path.join(crypto_base_path, "index.html")}'

    crypto_page.goto(index_path)

    # Login
    crypto_page.locator('#start-investing-btn').click()
    crypto_page.locator('#email').fill('demo@example.com')
    crypto_page.locator('#password').fill('password123')
    crypto_page.locator('#login-form button').click()

    # Verify dashboard load and wait for async content
    expect(crypto_page).to_have_url(re.compile(r".*dashboard\.html"))
    expect(crypto_page.locator('.crypto-card').first).to_be_visible(timeout=15000)
    print("Login successful, dashboard loaded.")

    # Verify navbar dropdown
    user_nav_balance = crypto_page.locator('#user-nav-balance')
    expect(user_nav_balance).to_contain_text("Balance: $10,000")
    user_nav_balance.click()
    user_dropdown = crypto_page.locator('#user-dropdown')
    expect(user_dropdown).to_be_visible()
    expect(user_dropdown).to_contain_text("Demo User")
    print("Navbar dropdown works.")

    # Verify initial balances
    investment_balance = crypto_page.locator('#investment-balance')
    expect(investment_balance).to_contain_text("$0")
    expect(crypto_page.locator('.no-investments')).to_be_visible()
    print("Initial balances correct.")

    # Perform investment
    crypto_page.locator('.btn-invest').first.click()
    invest_modal = crypto_page.locator('#invest-modal')
    expect(invest_modal).to_be_visible()
    invest_modal.locator('#amount').fill("500")
    invest_modal.locator('button[type="submit"]').click()

    # Verify balance updates after investment
    expect(user_nav_balance).to_contain_text("Balance: $9,500")
    expect(investment_balance).to_contain_text("$500")
    print("Investment successful, balances updated.")

    # Perform withdrawal
    crypto_page.locator('#withdraw-btn').click()

    # Verify balance updates after withdrawal
    expect(user_nav_balance).to_contain_text("Balance: $10,000")
    expect(investment_balance).to_contain_text("$0")
    expect(crypto_page.locator('.no-investments')).to_be_visible()
    print("Withdrawal successful, balances updated.")

    crypto_context.close()

    # --- Verify Real Estate Site ---
    print("\n--- Verifying Real Estate Site ---")
    re_context = browser.new_context()
    re_page = re_context.new_page()
    re_base_path = os.path.abspath('real_estate_brokerage')
    re_index_path = f'file://{os.path.join(re_base_path, "index.html")}'
    re_property_path = f'file://{os.path.join(re_base_path, "property.html?id=1")}'

    re_page.goto(re_index_path)

    # Verify images and social links
    expect(re_page.locator('.property-card img').first).to_be_visible()
    image_width = re_page.locator('.property-card img').first.evaluate("el => el.naturalWidth")
    assert image_width > 0, "Real estate image did not load"
    expect(re_page.get_by_role("link", name="WhatsApp")).to_be_visible()
    print("Real estate homepage verification PASSED.")

    # Verify property page
    re_page.goto(re_property_path)
    expect(re_page.locator('select[name="financing"] option[value="cash"]')).to_have_count(0)
    expect(re_page.get_by_role("link", name="contact an agent")).to_be_visible()
    print("Real estate property page verification PASSED.")

    re_context.close()
    browser.close()

with sync_playwright() as playwright:
    run_final_verification(playwright)

print("\nAll final verifications successful.")
