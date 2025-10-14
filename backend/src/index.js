require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const pingRoutes = require('./routes/ping.routes');
const demoRoutes = require('./routes/demo.routes');
const authRoutes = require('./routes/auth.routes');
const staffRoutes = require('./routes/staff.routes');
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const attributeRoutes = require("./routes/attribute.routes");
const variantRoutes = require("./routes/productVariant.routes");
const variantAttrRoutes = require("./routes/variantAttribute.routes");
const attrCategoryRoutes = require("./routes/attributeCategory.routes");
const productFullRoutes = require("./routes/productFull.routes");
const customerOrderRoutes = require("./routes/customerOrder.routes");
const purchaseOrderRoutes = require("./routes/purchaseOrder.routes");

const { notFound, errorHandler } = require('./middlewares/error');

const app = express();

// Middlewares base
app.use(helmet());
app.use(cors({ origin: true, credentials: true })); // oppure origin: 'http://localhost:5173'
app.use(express.json());
app.use(morgan('dev'));
app.use(hpp());
app.use(compression());
app.use(cookieParser());




// Routes
app.use('/api', pingRoutes);
app.use('/api', demoRoutes);
app.use('/api/auth', authRoutes); // <-- aggiunta
app.use('/api/staff', staffRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/attributes", attributeRoutes);

app.use("/api/variants", variantRoutes);
app.use("/api/variant-attributes", variantAttrRoutes);
app.use("/api/attribute-category", attrCategoryRoutes);
app.use("/api/products", productFullRoutes);

app.use("/api/orders", customerOrderRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
// Health root
app.get('/', (req, res) => {
  res.json({ name: 'TechStore API', status: 'running' });
});

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ API listening on http://localhost:${PORT}`);
});
