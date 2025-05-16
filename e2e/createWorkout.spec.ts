import { test, expect } from '@playwright/test';

test.describe('Workout creation by trainer', () => {
    test('Trainer can create workout for multiple clients', async ({ page }) => {
        // 1. Переход на главную страницу
        await page.goto('/');

        // 2. Проверка, что пользователь не авторизован (кнопка "Войти" доступна)
        await expect(page.getByRole('link', { name: 'Войти' })).toBeVisible();

        // 3. Нажимаем на ссылку "Войти"
        await page.getByRole('link', { name: 'Войти' }).click();

        // 4. Процесс авторизации
        // Заполняем поле "Email" для входа
        await page.getByLabel('Email').fill('ekaterina@blank.com');

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
        await expect(emailCell).toContainText('<ekaterina@blank.com>');

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


        // 2. Перейти на страницу тренировок
        await newPage.getByRole('link', { name: 'Программы' }).click();
        await newPage.getByRole('link', { name: /Новая тренировка/i }).click();

        // 3. Заполнить поля формы
        await newPage.getByLabel(/Название тренировки/i).fill('Утренняя силовая');
        await newPage.getByLabel(/Тип тренировки/i).selectOption('strength');
        await newPage.getByLabel(/Длительность/i).fill('45');
        await newPage.getByLabel(/Описание/i).fill('Силовая тренировка для продвинутых');

        // 4. Добавить упражнение (пример: вручную добавить поле, если это поддерживается в UI)
        await newPage.getByRole('button', { name: /Добавить упражнение/i }).click();
        await newPage.locator('input[name="exercises.0.name"]').fill('Приседания');
        await newPage.locator('input[name="exercises.0.sets"]').fill('3');
        await newPage.locator('input[name="exercises.0.reps"]').fill('12');

        // // 5. Выбрать клиентов (предположим, чекбоксы с именами)
        const checkboxes = newPage.getByRole('checkbox');
        await checkboxes.nth(0).check();
        await checkboxes.nth(1).check();

        // 6. Отправить форму
        await newPage.getByRole('button', { name: /создать тренировку/i }).click();

        // 7. Нажать "Назад к списку программ"
        await newPage.getByRole('button', { name: /назад к списку программ/i }).click();

        // 8. Проверить, что тренировка появилась
        await expect(newPage).toHaveURL(/\/workouts/);
        await expect(newPage.getByText('Утренняя силовая')).toBeVisible();
    });
});
