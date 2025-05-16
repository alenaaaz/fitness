import { test, expect } from '@playwright/test';

test.describe('Админ - Редактирование пользователя', () => {
    test('должен авторизовать и позволить редактировать пользователя', async ({ page }) => {
        // 1. Переход на главную страницу
        await page.goto('/');

        // 2. Проверка, что пользователь не авторизован (кнопка "Войти" доступна)
        await expect(page.getByRole('link', { name: 'Войти' })).toBeVisible();

        // 3. Нажимаем на ссылку "Войти"
        await page.getByRole('link', { name: 'Войти' }).click();

        // 4. Процесс авторизации
        // Заполняем поле "Email" для входа
        await page.getByLabel('Email').fill('admin@example.com');

        // Кликаем на кнопку для отправки данных и входа
        await page.getByRole('button').click();

        // Переходим на локальный сервер, чтобы подтвердить успешный вход
        await page.goto('http://localhost:1080/');
        await page.waitForURL('http://localhost:1080/');

        // 5. Ожидаем загрузки таблицы
        await page.waitForSelector('table');
        const table = page.locator('table');
        await expect(table).toBeVisible(); // Проверяем, что таблица отображается

        // 6. Ожидаем появления строк в таблице
        await page.waitForSelector('tr');

        // Проверяем, что в первой строке таблицы отображается email администратора
        const emailCell = page.locator('tr').nth(1).locator('td').nth(1);
        await expect(emailCell).toContainText('<admin@example.com>');

        // 7. Кликаем на первую строку для редактирования пользователя
        const firstRow = page.locator('tr').nth(1);
        await firstRow.click();

        // 8. Ожидаем появления iframe для редактирования
        await page.waitForSelector('iframe');
        const frame = page.frameLocator('iframe');

        // Находим ссылку "Sign in" внутри iframe
        const signInLink = frame.getByRole('link', { name: 'Sign in' });

        // Ждём, пока ссылка станет доступной
        await signInLink.waitFor({ state: 'visible', timeout: 30000 });

        // Ожидаем открытия нового окна с редактированием пользователя
        const [newPage] = await Promise.all([
            page.context().waitForEvent('page'),
            signInLink.click() // Кликаем на ссылку для перехода
        ]);
        await newPage.waitForLoadState('networkidle'); // Ожидаем загрузки новой страницы

        // Переводим страницу на передний план
        await newPage.bringToFront();

        // 9. Ожидаем, пока загрузится главная страница после авторизации
        await newPage.waitForURL('http://localhost:3000/');

        // 10. Переходим в раздел "Пользователи"
        await newPage.getByRole('link', { name: 'Пользователи' }).click();

        // 11. Проверяем, что на странице отображается заголовок "Список пользователей"
        await expect(newPage.getByRole('heading', { name: 'Список пользователей' })).toBeVisible();

        // 12. Пытаемся нажать на кнопку "Редактировать" для первого пользователя
        await newPage.getByRole('link', { name: 'Редактировать' }).first().click();

        // 13. Проверяем, что форма редактирования пользователя появилась
        await expect(newPage.getByLabel('Имя')).toBeVisible(); // Проверяем наличие поля "Имя"
    });
});
