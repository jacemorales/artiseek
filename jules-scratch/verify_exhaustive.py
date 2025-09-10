import os
import re
import asyncio
from playwright.async_api import async_playwright, expect

async def run_exhaustive_verification():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Create a new context with no persistent storage
        context = await browser.new_context(storage_state=None)
        page = await context.new_page()

        base_path = os.path.abspath('crypto_brokerage')
        index_path = f'file://{os.path.join(base_path, "index.html")}'

        # --- Test Login and Initial State ---
        print("--- Verifying Login and Initial State ---")
        await page.goto(index_path)

        # Login
        await page.locator('#start-investing-btn').click()
        await page.locator('#email').fill('demo@example.com')
        await page.locator('#password').fill('password123')
        await page.locator('#login-form button').click()

        # Verify dashboard load
        await expect(page).to_have_url(re.compile(r".*dashboard\.html"), timeout=10000)
        await expect(page.locator('.crypto-card').first).to_be_visible(timeout=15000)

        user_nav_balance = page.locator('#user-nav-balance')
        await expect(user_nav_balance).to_contain_text("Balance: $10,000")
        print("Login successful, initial balance correct.")

        # --- Test Top Up Flow ---
        print("\n--- Verifying Top Up Flow ---")
        await user_nav_balance.click()
        await page.locator('#top-up-btn').click()

        top_up_modal = page.locator('#top-up-modal')
        await expect(top_up_modal).to_be_visible()
        await top_up_modal.locator('#top-up-amount').fill("500")
        page.once("dialog", lambda dialog: dialog.dismiss())
        await top_up_modal.locator('button[type="submit"]').click()

        await expect(user_nav_balance).to_contain_text("Balance: $10,500")
        print("Top up successful.")

        # --- Test Investment Flow ---
        print("\n--- Verifying Investment Flow ---")
        await page.locator('.btn-invest').first.click()
        invest_modal = page.locator('#invest-modal')
        await expect(invest_modal).to_be_visible()
        await invest_modal.locator('#amount').fill("500")
        page.once("dialog", lambda dialog: dialog.dismiss())
        await invest_modal.locator('button[type="submit"]').click()

        investment_balance = page.locator('#investment-balance')
        await expect(user_nav_balance).to_contain_text("Balance: $10,000")
        await expect(investment_balance).to_contain_text("$500")
        print("Investment successful.")

        # --- Test Withdrawal Flow ---
        print("\n--- Verifying Withdrawal Flow ---")
        page.once("dialog", lambda dialog: dialog.dismiss())
        await page.locator('#withdraw-btn').click()

        await expect(user_nav_balance).to_contain_text("Balance: $10,500")
        await expect(investment_balance).to_contain_text("$0")
        print("Withdrawal successful.")

        await context.close()
        await browser.close()

asyncio.run(run_exhaustive_verification())
print("\nAll features verified successfully.")
