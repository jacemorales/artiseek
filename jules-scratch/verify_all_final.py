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

    # Navigate and clear storage for a clean run
    crypto_page.goto(index_path)
    crypto_page.evaluate("() => { localStorage.clear(); sessionStorage.clear(); }")
    crypto_page.reload()

    # Login
    crypto_page.locator('#start-investing-btn').click()
    crypto_page.locator('#email').fill('demo@example.com')
    crypto_page.locator('#password').fill('password123')
    crypto_page.locator('#login-form button').click()

    # Verify dashboard load and wait for async content
    expect(crypto_page).to_have_url(re.compile(r".*dashboard\.html"))
    expect(crypto_page.locator('.crypto-card').first).to_be_visible(timeout=15000)
    print("Login successful, dashboard loaded.")

    # Verify initial balances
    user_nav_balance = crypto_page.locator('#user-nav-balance')
    expect(user_nav_balance).to_contain_text("Balance: $10,000")
    investment_balance = crypto_page.locator('#investment-balance')
    expect(investment_balance).to_contain_text("$0")
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
    print("Withdrawal successful, balances updated.")

    crypto_context.close()
    browser.close()

with sync_playwright() as playwright:
    run_final_verification(playwright)

print("\nAll final verifications successful.")
