import { test, expect } from '@playwright/test';
import { format } from 'date-fns';

test.describe('Календарь - добавление события', () => {
    test('пользователь может добавить тренировку в расписание', async ({ page }) => {
        // 1. Переход на главную страницу
        await page.goto('/');

        // 2. Авторизация пользователя
        // Кликаем на ссылку "Войти"
        await page.getByRole('link', { name: 'Войти' }).click();

        // Заполняем поле "Email" для авторизации
        await page.getByLabel('Email').fill('sergey@d.comn');

        // Кликаем на кнопку авторизации
        await page.getByRole('button').click();

        // 3. Переход на нужную страницу после авторизации (мокаем через ethereal)
        // Переходим на страницу, где отображается таблица с данными
        await page.goto('http://localhost:1080/');
        await page.waitForSelector('table');

        // Проверяем, что в таблице в нужной ячейке отображается ожидаемый email
        const emailCell = page.locator('tr').nth(1).locator('td').nth(1);
        await expect(emailCell).toContainText('<sergey@d.comn>');

        // Кликаем по первой строке таблицы
        await page.locator('tr').nth(1).click();

        // 4. Ожидаем появления iframe и взаимодействуем с ним
        await page.waitForSelector('iframe');
        const frame = page.frameLocator('iframe');

        // Находим ссылку "Sign in" в iframe
        const signInLink = frame.getByRole('link', { name: 'Sign in' });

        // Ожидаем перехода на новую страницу
        const [newPage] = await Promise.all([
            page.context().waitForEvent('page'),
            signInLink.click()
        ]);
        await newPage.waitForLoadState('networkidle');
        await newPage.bringToFront();

        // 5. Переход к расписанию
        await newPage.getByRole('link', { name: 'Расписание' }).click();

        // 6. Ожидаем, пока отобразится заголовок расписания
        await expect(newPage.getByRole('heading', { name: 'Мое расписание тренировок' })).toBeVisible();

        // 7. Кликаем по текущей дате в календаре
        const today = new Date();
        const dateSelector = `[data-date="${format(today, 'yyyy-MM-dd')}"]`;
        await newPage.waitForSelector(dateSelector); // Ожидаем, пока элемент с нужной датой станет доступным
        await newPage.locator(dateSelector).click(); // Кликаем по дате

        // 8. Ожидаем появления модального окна для добавления события
        const modal = newPage.locator('text=Добавить событие на');
        await expect(modal).toBeVisible();

        // 9. Выбираем тренировку и указываем время
        const select = newPage.locator('select');
        await select.selectOption({ index: 1 }); // Выбираем первую доступную тренировку
        await newPage.locator('input[type="time"]').fill('12:00'); // Устанавливаем время для тренировки
        // 10. Нажимаем кнопку "Добавить" для добавления события
        await newPage.getByRole('button', { name: 'Добавить' }).click();

        // 11. Проверяем, что событие появилось в календаре
        const workoutTitle = (await select.locator('option:checked').textContent())?.trim();
        console.log('Selected workout title:', workoutTitle);

        await expect(
            newPage.locator(`.fc-event:has-text("${workoutTitle}")`)
        ).toBeVisible({ timeout: 10000 });
    });
});
