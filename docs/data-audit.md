# Data audit — World Bank indicators

Checked on **2026-10-23** against the World Bank API (World Development Indicators, last updated by the World Bank on 2026-10-08).

Request used for each indicator:

```
https://api.worldbank.org/v2/country/PAK;IND;BGD/indicator/{CODE}?format=json&per_page=500&date=2000:2026
```

**Result: all 23 indicators return data for Pakistan, India and Bangladesh.** None need to be removed or replaced.

## How to read the table

- **Latest year:** the most recent year with a non-null value for that country.
- **Missing years since 2000:** the number of years with no value (`null`), counted from 2000 to the newest year *any* of the three countries has data for that indicator.
  For example, health expenditure is counted from 2000 to 2023, because no country has 2024 data yet. Years the World Bank has not published for anyone are not counted as missing.

## Results

| Category | Indicator | Code | Latest year (PAK / IND / BGD) | Missing years since 2000 (PAK / IND / BGD) |
|---|---|---|---|---|
| Economy | GDP (current US$) | NY.GDP.MKTP.CD | 2025 / 2025 / 2025 | 0 / 0 / 0 |
| Economy | GDP per capita (current US$) | NY.GDP.PCAP.CD | 2025 / 2025 / 2025 | 0 / 0 / 0 |
| Economy | GDP growth (annual %) | NY.GDP.MKTP.KD.ZG | 2025 / 2025 / 2025 | 0 / 0 / 0 |
| Economy | Inflation, consumer prices (annual %) | FP.CPI.TOTL.ZG | 2025 / 2025 / 2025 | 0 / 0 / 0 |
| Economy | Unemployment (% of labour force) | SL.UEM.TOTL.ZS | 2025 / 2025 / 2025 | 0 / 0 / 0 |
| Economy | Personal remittances received (current US$) | BX.TRF.PWKR.CD.DT | 2025 / 2025 / 2025 | 0 / 0 / 0 |
| Population | Population (people) | SP.POP.TOTL | 2025 / 2025 / 2025 | 0 / 0 / 0 |
| Population | Population growth (annual %) | SP.POP.GROW | 2025 / 2025 / 2025 | 0 / 0 / 0 |
| Population | Urban population (% of total) | SP.URB.TOTL.IN.ZS | 2025 / 2025 / 2025 | 0 / 0 / 0 |
| Population | Fertility rate (births per woman) | SP.DYN.TFRT.IN | 2024 / 2024 / 2024 | 0 / 0 / 0 |
| Health | Life expectancy at birth (years) | SP.DYN.LE00.IN | 2024 / 2024 / 2024 | 0 / 0 / 0 |
| Health | Infant mortality (per 1,000 live births) | SP.DYN.IMRT.IN | 2024 / 2024 / 2024 | 0 / 0 / 0 |
| Health | Under-5 mortality (per 1,000 live births) | SH.DYN.MORT | 2024 / 2024 / 2024 | 0 / 0 / 0 |
| Health | Current health expenditure (% of GDP) | SH.XPD.CHEX.GD.ZS | 2023 / 2023 / 2023 | 0 / 0 / 0 |
| Education | Adult literacy rate (% ages 15+) | SE.ADT.LITR.ZS | 2021 / 2024 / 2022 | 11 / 13 / 12 |
| Education | Primary school enrolment (% gross) | SE.PRM.ENRR | 2024 / 2025 / 2024 | 2 / 3 / 13 |
| Education | Secondary school enrolment (% gross) | SE.SEC.ENRR | 2024 / 2025 / 2024 | 5 / 0 / 2 |
| Education | Government spending on education (% of GDP) | SE.XPD.TOTL.GD.ZS | 2023 / 2022 / 2024 | 4 / 6 / 2 |
| Technology | Internet users (% of population) | IT.NET.USER.ZS | 2024 / 2025 / 2024 | 5 / 0 / 1 |
| Technology | Mobile subscriptions (per 100 people) | IT.CEL.SETS.P2 | 2024 / 2024 / 2024 | 0 / 0 / 0 |
| Energy & Environment | Access to electricity (% of population) | EG.ELC.ACCS.ZS | 2024 / 2024 / 2024 | 0 / 0 / 0 |
| Energy & Environment | Forest area (% of land area) | AG.LND.FRST.ZS | 2024 / 2024 / 2024 | 0 / 0 / 0 |
| Gender | Female labour force participation (% of females 15+) | SL.TLF.CACT.FE.ZS | 2025 / 2025 / 2025 | 0 / 0 / 0 |

## What this means for the app

- **Literacy** is only reported in some years, with roughly half the years missing for every country. Draw it as points, not a continuous line.
- **Primary enrolment for Bangladesh** (13 missing years) and **secondary enrolment, internet users and education spending** have scattered gaps. Lines must break at gaps, never drop to zero.
- **The latest year differs by country** for several indicators, for example education spending: 2023 / 2022 / 2024. So the summary cards must show each country's own year.
- **An invalid indicator code still returns HTTP 200**, with the body `[{ "message": [...] }]` instead of `[metadata, rows]`. Checking `response.ok` is not enough; the code must also check that the rows array exists.
