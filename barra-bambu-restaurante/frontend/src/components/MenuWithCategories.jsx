import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import '../styles/MenuWithCategories.scss';

const MenuWithCategories = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('/api/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category_id === selectedCategory);

  const addToCart = (item) => {
    setCart([...cart, { ...item, quantity: 1 }]);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  return (
    <Container className="menu-container py-5">
      <h2 className="text-center mb-5">Cardápio</h2>
      
      {/* Botões de categorias */}
      <div className="category-buttons mb-4">
        <Button 
          variant={selectedCategory === 'all' ? 'warning' : 'outline-warning'}
          onClick={() => setSelectedCategory('all')}
          className="me-2 mb-2"
        >
          Todos
        </Button>
        
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'warning' : 'outline-warning'}
            onClick={() => setSelectedCategory(category.id)}
            className="me-2 mb-2"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Grid de itens */}
      <Row className="g-4">
        {filteredItems.map(item => (
          <Col key={item.id} lg={4} md={6} sm={12}>
            <Card className="menu-item-card h-100">
              {item.image_url && (
                <Card.Img 
                  variant="top" 
                  src={item.image_url} 
                  alt={item.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="price">R$ {parseFloat(item.price).toFixed(2)}</span>
                  <Button 
                    variant="warning" 
                    size="sm"
                    onClick={() => addToCart(item)}
                  >
                    Adicionar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Carrinho sidebar */}
      {cart.length > 0 && (
        <div className="cart-sidebar mt-5 p-3 bg-light rounded">
          <h4>Seu Pedido ({cart.length} itens)</h4>
          <ul className="list-unstyled">
            {cart.map(item => (
              <li key={item.id} className="d-flex justify-content-between mb-2">
                <span>{item.name} x{item.quantity}</span>
                <div>
                  <span className="me-3">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    X
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="d-grid">
            <Button variant="success" size="lg">
              Finalizar Pedido (R$ {cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)})
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default MenuWithCategories;