import yfinance as yf

print("Test yfinance...")
print(f"Version: {yf.__version__}")

ticker = yf.Ticker("AAPL")
hist = ticker.history(period="3mo")

print(f"\nDonnées récupérées : {len(hist)} lignes")
if not hist.empty:
    print(f"Premier prix : {hist['Close'].iloc[0]:.2f}")
    print(f"Dernier prix : {hist['Close'].iloc[-1]:.2f}")
    print(f"Période : {hist.index[0].date()} → {hist.index[-1].date()}")
else:
    print("⚠️ Aucune donnée récupérée")