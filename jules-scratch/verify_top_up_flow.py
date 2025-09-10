import os
import re
from playwright.sync_api import sync_playwright, expect

def run_top_up_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    base_path = os.path.abspath('crypto_brokerage')
    index_path = f'file://{os.path.join(base_path, "index.html")}'

    # Navigate and clear storage for a clean run
    page.goto(index_path)
    page.evaluate("() => { localStorage.clear(); sessionStorage.clear(); }")
    page.goto(index_path) # Full re-navigation

    # --- Test Top Up and Invest Flow ---
    print("--- Verifying Top Up and Invest Flow ---")

    # Login
    page.locator('#start-investing-btn').click()
    page.locator('#email').fill('demo@example.com')
    page.locator('#password').fill('password123')
    page.locator('#login-form button').click()

    # Verify dashboard load
    expect(page).to_have_url(re.compile(r".*dashboard\.html"))
    user_nav_balance = page.locator('#user-nav-balance')
    expect(user_nav_balance).to_contain_text("Balance: $10,000")
    print("Login successful, initial balance correct.")

    # Open dropdown and click Top Up
    user_nav_balance.click()
    page.locator('#top-up-btn').click()

    # Perform Top Up
    top_up_modal = page.locator('#top-up-modal')
    expect(top_up_modal).to_be_visible()
    top_up_modal.locator('#top-up-amount').fill("500")

    # Set up alert listener for top up
    page.once("dialog", lambda dialog: dialog.dismiss())
    top_up_modal.locator('button[type="submit"]').click()

    # Verify balance updates after top up
    expect(user_nav_balance).to_contain_text("Balance: $10,500")
    print("Top up successful, total balance updated.")

    # Perform investment
    page.locator('.btn-invest').first.click()
    invest_modal = page.locator('#invest-modal')
    expect(invest_modal).to_be_visible()
    invest_modal.locator('#amount').fill("500")

    # Set up alert listener for investment
    page.once("dialog", lambda dialog: dialog.dismiss())
    invest_modal.locator('button[type="submit"]').click()

    # Verify balance updates after investment
    investment_balance = page.locator('#investment-balance')
    expect(user_nav_balance).to_contain_text("Balance: $10,000")
    expect(investment_balance).to_contain_text("$500")
    print("Investment successful, balances updated correctly.")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run_top_up_verification(playwright)

print("\nAll Top Up and Invest verifications successful.")
