import os
import re
import time
from playwright.sync_api import sync_playwright, expect

def run_signup_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    base_path = os.path.abspath('crypto_brokerage')
    index_path = f'file://{os.path.join(base_path, "index.html")}'

    # --- Test Sign Up Flow ---
    print("--- Verifying New User Sign-Up Flow ---")
    page.goto(index_path)

    # Navigate to signup form
    page.locator('#start-investing-btn').click()
    page.locator('#show-signup').click()

    # Fill out and submit signup form
    signup_form = page.locator('#signup-form')
    expect(signup_form).to_be_visible()
    new_user_email = f"testuser{int(time.time())}@example.com"
    signup_form.locator('#fullName').fill("Test User")
    signup_form.locator('#signup-email').fill(new_user_email)
    signup_form.locator('#signup-password').fill("newpassword")
    signup_form.locator('#confirm-password').fill("newpassword")
    signup_form.locator('button[type="submit"]').click()

    # Verify dashboard load for new user
    expect(page).to_have_url(re.compile(r".*dashboard\.html"), timeout=10000)
    print("Sign-up successful, dashboard loaded.")

    # Verify initial balances for new user
    user_nav_balance = page.locator('#user-nav-balance')
    investment_balance = page.locator('#investment-balance')
    expect(user_nav_balance).to_contain_text("Balance: $0")
    expect(investment_balance).to_contain_text("$0")
    print("New user initial balances are correct.")

    # Verify that investing fails with 0 balance
    page.locator('.btn-invest').first.click()
    invest_modal = page.locator('#invest-modal')
    expect(invest_modal).to_be_visible()

    # Set up a listener for the alert dialog
    dialog_message = None
    def handle_dialog(dialog):
        nonlocal dialog_message
        dialog_message = dialog.message
        dialog.accept() # Accept the alert

    page.on("dialog", handle_dialog)

    invest_modal.locator('#amount').fill("500")
    invest_modal.locator('button[type="submit"]').click()

    page.wait_for_timeout(500)
    assert dialog_message == "Insufficient funds."

    # Assert that the modal is STILL visible
    expect(invest_modal).to_be_visible()
    print("Investment correctly failed and modal remained open.")

    # --- Test Logout and Login for New User ---
    print("\n--- Verifying Logout and Login for New User ---")
    # Manually close the modal before logging out
    invest_modal.locator('.close-button').click()
    expect(invest_modal).not_to_be_visible()

    page.locator('#logout-btn').click()
    expect(page).to_have_url(re.compile(r".*index\.html"))
    print("Logout successful.")

    # Log back in
    page.locator('#start-investing-btn').click()
    login_form = page.locator('#login-form')
    expect(login_form).to_be_visible()
    login_form.locator('#email').fill(new_user_email)
    login_form.locator('#password').fill("newpassword")
    login_form.locator('button[type="submit"]').click()

    # Verify dashboard re-load
    expect(page).to_have_url(re.compile(r".*dashboard\.html"))
    expect(page.locator('#user-nav-balance')).to_contain_text("Balance: $0")
    print("Login with new user credentials successful.")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run_signup_verification(playwright)

print("\nAll sign-up and dashboard verifications successful.")
