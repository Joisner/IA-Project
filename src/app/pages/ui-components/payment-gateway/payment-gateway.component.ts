import { Component, OnInit, OnDestroy } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.scss'
})
export class PaymentGatewayComponent implements OnInit, OnDestroy {
  stripe: any;
  card: any;
  processing = false;
  paymentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      billingAddress: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      country: ['', Validators.required]
    });
  }

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
          color: '#dc2626',
          iconColor: '#dc2626'
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
    if (this.paymentForm.invalid || this.processing) {
      return;
    }

    this.processing = true;

    try {
      const { token, error } = await this.stripe.createToken(this.card);

      if (error) {
        const errorElement = document.getElementById('card-errors');
        errorElement!.textContent = error.message;
        this.processing = false;
        return;
      }

      const paymentData = {
        ...this.paymentForm.value,
        token: token
      };

      // Simular envío al servidor
      console.log('Datos de pago:', paymentData);
      await new Promise(resolve => setTimeout(resolve, 2000));

      Swal.fire({
        icon: 'success',
        title: 'Pago procesado con éxito',
        showConfirmButton: true,
        timer: 1500
      });

      this.paymentForm.reset();
      
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