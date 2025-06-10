import { test, expect } from '@playwright/test';

test.describe('검색 페이지 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
  });

  test('검색 입력창이 화면에 보여야 한다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('경매 제목 입력');
    await expect(searchInput).toBeVisible();
  });

  test('검색 결과가 없을 경우 빈 상태 메시지가 보여야 한다', async ({ page }) => {
    const emptyMsg = page.getByText('검색 결과가 없습니다.');
    await expect(emptyMsg).toBeVisible();
  });

  test('검색어를 입력한 뒤 엔터를 누르면 결과 카드가 보여야 한다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('경매 제목 입력');
    await searchInput.click();
    await searchInput.fill('아이폰');
    await searchInput.press('Enter');

    await page.waitForSelector('text=현재 입찰가'); 

    const cards = page.locator('.auction-card'); 
    await expect(cards).toHaveCount(12);
  });

  test('필터 UI가 정상적으로 동작하는지 확인', async ({ page }) => {
    const categoryFilterTitle = page.getByText('검색 필터');
    await expect(categoryFilterTitle).toBeVisible();

    const priceFilter = page.getByText('경매 시작가');
    await expect(priceFilter).toBeVisible();

    const pendingFilter = page.getByText('시작 전');
    await expect(pendingFilter).toBeVisible();
    await pendingFilter.click();
    await expect(page).toHaveURL(/\/search\?isPending=true$/);
    await pendingFilter.click();

    const onGoingFilter = page.getByText('진행중');
    await expect(onGoingFilter).toBeVisible();
    await onGoingFilter.click();
    await expect(page).toHaveURL(/\/search\?isActive=true$/);
    await onGoingFilter.click();

    const completedFilter = page.getByText('경매 완료');
    await expect(completedFilter).toBeVisible();
    await completedFilter.click();
    await expect(page).toHaveURL(/\/search\?isCompleted=true$/);
    await completedFilter.click();

    const brandNewFilter = page.getByText('새 상품');
    await expect(brandNewFilter).toBeVisible();
    await brandNewFilter.click();
    await expect(page).toHaveURL(/\/search\?isBrandNew=true$/);
    await brandNewFilter.click();

    const likeNewFilter = page.getByText('사용감 없음');
    await expect(likeNewFilter).toBeVisible();
    await likeNewFilter.click();
    await expect(page).toHaveURL(/\/search\?isLikeNew=true$/);
    await likeNewFilter.click();

    const gentlyUsedFilter = page.getByText('사용감 적음');
    await expect(gentlyUsedFilter).toBeVisible();
    await gentlyUsedFilter.click();
    await expect(page).toHaveURL(/\/search\?isGentlyUsed=true$/);
    await gentlyUsedFilter.click();

    const heavilyUsedFilter = page.getByText('사용감 많음');
    await expect(heavilyUsedFilter).toBeVisible();
    await heavilyUsedFilter.click();
    await expect(page).toHaveURL(/\/search\?isHeavilyUsed=true$/);
    await heavilyUsedFilter.click();

    const damagedFilter = page.getByText('고장/파손 상품');
    await expect(damagedFilter).toBeVisible();
    await damagedFilter.click();
    await expect(page).toHaveURL(/\/search\?isDamaged=true$/);
    await damagedFilter.click();
  });

  test('검색 결과 정렬이 정상적으로 작동하는지 확인', async ({ page }) => {
    const latestOrder = page.getByText('최신순');
    await expect(latestOrder).toBeVisible();
    await latestOrder.click();
    await expect(page).toHaveURL(/\/search\?sortBy=latest$/);
    await latestOrder.click();

    const lowStartPriceOrder = page.getByText('낮은 시작 가격순');
    await expect(lowStartPriceOrder).toBeVisible();
    await lowStartPriceOrder.click();
    await expect(page).toHaveURL(/\/search\?sortBy=price_asc$/);
    await lowStartPriceOrder.click();

    const highStartPriceOrder = page.getByText('높은 시작 가격순');
    await expect(highStartPriceOrder).toBeVisible();
    await highStartPriceOrder.click();
    await expect(page).toHaveURL(/\/search\?sortBy=price_desc$/);
    await highStartPriceOrder.click();

    const bidderCountOrder = page.getByText('입찰자순');
    await expect(bidderCountOrder).toBeVisible();
    await bidderCountOrder.click();
    await expect(page).toHaveURL(/\/search\?sortBy=bidder_count_desc$/);
    await bidderCountOrder.click();

    const likeCountOrder = page.getByText('찜순');
    await expect(likeCountOrder).toBeVisible();
    await likeCountOrder.click();
    await expect(page).toHaveURL(/\/search\?sortBy=scrap_count_desc$/);
    await likeCountOrder.click();
  });

  test('검색 결과 페이지네이션이 정상적으로 렌더링되는지 확인', async ({ page }) => {
    const searchInput = page.getByPlaceholder('경매 제목 입력');
    await searchInput.fill('아이패드');
    await searchInput.press('Enter');

    const nextPageButton = page.locator('[aria-label="Go to next page"]');
    await expect(nextPageButton).toBeVisible();
    await nextPageButton.click();
    await expect(page).toHaveURL(/\/search\?keyword=%EC%95%84%EC%9D%B4%ED%8C%A8%EB%93%9C&page=2$/);

    const previousPageButton = page.locator('[aria-label="Go to previous page"]');
    await expect(previousPageButton).toBeVisible();
    await previousPageButton.click();
    await expect(page).toHaveURL(/\/search\?keyword=%EC%95%84%EC%9D%B4%ED%8C%A8%EB%93%9C&page=1$/);
  });
});