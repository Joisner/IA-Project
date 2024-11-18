import { Component } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.scss'
})
export class PaymentGatewayComponent {
  stripe: any;
  card: any;
  processing = false;

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51QMYLqLfrduBrebjrWiA1VlQpyZyza0dfODV9CuyYRLACdLnPUVpHsYxJchJJULa4plPxMJw3MTS9bIYVmpb67rN00ut164eqY');
    const elements = this.stripe.elements();
    
    this.card = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }
    });
    this.card.mount('#card-element');

    this.card.addEventListener('change', (event: any) => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError!.textContent = event.error.message;
      } else {
        displayError!.textContent = '';
      }
    });
  }

  async handleSubmit() {
    this.processing = true;

    try {
      const { token, error } = await this.stripe.createToken(this.card);

      if (error) {
        const errorElement = document.getElementById('card-errors');
        errorElement!.textContent = error.message;
        this.processing = false;
        return;
      }

      // Aquí deberías enviar el token a tu servidor para procesar el pago
      console.log('Token generado:', token);
      // Simular una respuesta del servidor
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('¡Pago procesado con éxito!');
      
    } catch (err: any) {
      console.error('Error en el pago:', err);
      const errorElement = document.getElementById('card-errors');
      errorElement!.textContent = 'Hubo un error al procesar el pago. Por favor, inténtalo de nuevo.';
    }

    this.processing = false;
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.destroy();
    }
  }
}