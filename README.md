# 🚚 CC Route Optimizer

A full-stack delivery route optimization app built with **FastAPI**, **MongoDB**, and **React**. Enter a warehouse location and delivery stops, and the app automatically geocodes the addresses and calculates the most efficient delivery route using the **Nearest Neighbour algorithm**.

Built as a personal project.

---

## ✨ Features

- 📍 **Automatic geocoding** — type any address and get real coordinates
- 🧠 **Route optimization** — Nearest Neighbour algorithm finds the most efficient stop order
- 🗺️ **Interactive map** — visualize routes on a live Amsterdam map with React Leaflet
- 📊 **Route stats** — total distance (Haversine formula) and estimated duration
- ➕ **Create routes** — add routes with up to 8 stops via a modal form
- 🗑️ **Delete routes** — remove routes from the sidebar
- 📱 **Responsive** — drawer sidebar for mobile, grid layout for desktop

---

## 🛠️ Tech Stack

### Backend
| Tool | Purpose |
|------|---------|
| FastAPI | REST API framework |
| MongoDB + PyMongo | Database |
| Pydantic | Data validation |
| Nominatim (OpenStreetMap) | Geocoding |

### Frontend
| Tool | Purpose |
|------|---------|
| React + TypeScript | UI framework |
| Vite | Build tool |
| Tailwind CSS v4 | Styling |
| React Leaflet | Interactive map |
| Axios | HTTP client |

---

## 🏗️ Architecture
```
delivery-optimizer/
├── backend/
│   ├── main.py              # FastAPI app + CORS
│   ├── database.py          # MongoDB connection
│   ├── models.py            # Pydantic models
│   ├── routers/
│   │   └── routes.py        # API endpoints
│   └── services/
│       ├── geocoding.py     # Address → coordinates
│       └── optimizer.py     # Nearest neighbour algorithm
└── frontend/
    └── src/
        ├── api/             # Axios API calls
        ├── components/      # React components
        ├── pages/           # Dashboard page
        ├── types/           # TypeScript interfaces
        └── utils/           # Leaflet map icons
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB Atlas account (free tier works)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```
MONGO_URI=your_mongodb_connection_string
```

Start the server:
```bash
uvicorn main:app --reload
```

API will be available at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

App will be available at `http://localhost:5174`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/routes` | List all routes |
| POST | `/routes` | Create a new route |
| GET | `/routes/{id}` | Get a specific route |
| DELETE | `/routes/{id}` | Delete a route |
| POST | `/routes/{id}/optimize` | Run optimization algorithm |

---

## 🧠 How the Optimization Works

1. **Geocoding** — each address is converted to lat/lng coordinates using OpenStreetMap's Nominatim API
2. **Distance matrix** — Haversine formula calculates real-world distances between all stops
3. **Nearest Neighbour** — starting from the warehouse, always visit the closest unvisited stop next
4. **Result** — stops get updated `order_number` values, total distance and estimated time are calculated


---

## 🔮 Planned Features

- [ ] Authentication — courier login
- [ ] Real-time route tracking
- [ ] Export route as PDF for the delivery driver
- [ ] Multi-day route planning

---

## 👩‍💻 Author

Built by **Carina Costache**  
Master's student in Software Engineering 
