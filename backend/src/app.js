import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import ItemRouter from './routes/item.routes.js'
import authrouter from './routes/auth.route.js'
const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

app.use(cors({
  origin: ["http://localhost:5000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
  // allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get('/', (req, res) => {
  res.send('hello world')
})


let items = [];

// Routes
app.get('/api/items', (req, res) => {
  const { collection, limit = 50, page = 1 } = req.query;

  let filteredItems = items;

  if (collection) {
    filteredItems = filteredItems.filter(item => item.collection === collection);
  }

  // Pagination
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);

  res.json({
    items: filteredItems.slice(start, end),
    total: filteredItems.length,
    page: parseInt(page),
    limit: parseInt(limit)
  });
});

app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.post('/api/items', (req, res) => {
  const newItem = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  console.log(newItem);
  items.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === req.params.id);
  if (index !== -1) {
    items[index] = { ...items[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json(items[index]);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.delete('/api/items/:id', (req, res) => {
  items = items.filter(i => i.id !== req.params.id);
  res.status(204).send();
});

// Search endpoint
app.get('/api/search', (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.json([]);
  }

  const results = items.filter(item => {
    return item.title?.toLowerCase().includes(q.toLowerCase()) ||
      item.notes?.toLowerCase().includes(q.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(q.toLowerCase()));
  });

  res.json(results);
});

app.use('/api/auth', authrouter)
app.use('/api/items', ItemRouter)
export default app;