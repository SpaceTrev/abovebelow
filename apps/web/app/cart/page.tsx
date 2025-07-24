'use client'

import { useCartStore } from '@abovebelow/commerce'
import styled from 'styled-components'

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const CartItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  align-items: center;
`

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`

const ItemDetails = styled.div`
  flex: 1;
`

const ItemTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`

const ItemVariant = styled.p`
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
`

const ItemPrice = styled.p`
  margin: 0;
  font-weight: bold;
`

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const RemoveButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #cc3333;
  }
`

const CartSummary = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
`

const TotalPrice = styled.h2`
  margin: 0 0 1rem 0;
  text-align: right;
`

const CheckoutButton = styled.button`
  width: 100%;
  background: #007bff;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ClearButton = styled.button`
  width: 100%;
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
  }
`

const formatPrice = (price: { amount: string; currencyCode: string }) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(parseFloat(price.amount))
}

const CartPage = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalItems, 
    totalPrice, 
    isEmpty 
  } = useCartStore()

  const handleQuantityChange = (variantId: string, change: number) => {
    const item = items.find(item => item.variantId === variantId)
    if (item) {
      updateQuantity(variantId, item.quantity + change)
    }
  }

  return (
    <Container>
      <h1>Shopping Cart ({totalItems} items)</h1>
      
      {isEmpty ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div>
            {items.map((item) => (
              <CartItem key={item.variantId}>
                {item.image && (
                  <ItemImage 
                    src={item.image.url} 
                    alt={item.image.altText || item.title}
                  />
                )}
                
                <ItemDetails>
                  <ItemTitle>{item.title}</ItemTitle>
                  {item.variantTitle !== 'Default Title' && (
                    <ItemVariant>{item.variantTitle}</ItemVariant>
                  )}
                  {item.selectedOptions.length > 0 && (
                    <ItemVariant>
                      {item.selectedOptions.map(option => 
                        `${option.name}: ${option.value}`
                      ).join(', ')}
                    </ItemVariant>
                  )}
                  <ItemPrice>
                    {formatPrice(item.price)}
                    {item.compareAtPrice && (
                      <span style={{ textDecoration: 'line-through', marginLeft: '0.5rem', color: '#999' }}>
                        {formatPrice(item.compareAtPrice)}
                      </span>
                    )}
                  </ItemPrice>
                </ItemDetails>
                
                <QuantityControls>
                  <QuantityButton 
                    onClick={() => handleQuantityChange(item.variantId, -1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </QuantityButton>
                  <span>{item.quantity}</span>
                  <QuantityButton 
                    onClick={() => handleQuantityChange(item.variantId, 1)}
                    disabled={!item.availableForSale}
                  >
                    +
                  </QuantityButton>
                </QuantityControls>
                
                <RemoveButton onClick={() => removeFromCart(item.variantId)}>
                  Remove
                </RemoveButton>
              </CartItem>
            ))}
          </div>
          
          <CartSummary>
            <TotalPrice>Total: {totalPrice}</TotalPrice>
            <CheckoutButton>
              Proceed to Checkout
            </CheckoutButton>
            <ClearButton onClick={clearCart}>
              Clear Cart
            </ClearButton>
          </CartSummary>
        </>
      )}
    </Container>
  )
}

export default CartPage