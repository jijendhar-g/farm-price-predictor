

## Already Done

The hourly cron job `ingest-prices-hourly` is **already active** and working:

- **Schedule**: `0 * * * *` (every hour, on the hour)
- **Action**: Calls the `ingest-prices` backend function via HTTP POST
- **Result**: Every hour it automatically fetches prices and generates fresh 7-day predictions for all 12 commodities

The backend logs confirm consistent hourly execution. Each run inserts price records and 84 predictions (12 commodities x 7 days).

**No changes are needed** -- the automatic hourly refresh is already in place.

### Current limitation
The data.gov.in API key is returning 403 ("Key not authorised"), so the system falls back to simulated data each hour. To get real live prices, the API key needs to be activated/authorized on the data.gov.in portal for the Agmarknet dataset.

