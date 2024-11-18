import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getIdToken
} from 'firebase/auth';
import { environment } from 'src/app/env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api'; // URL de tu backend
  private auth;
  private googleProvider;

  constructor(private http: HttpClient) {
    // Inicializa Firebase
    const app = initializeApp(environment.firebase);
    this.auth = getAuth(app);
    this.googleProvider = new GoogleAuthProvider();
  }

  // Autenticación con Google
  signInWithGoogle(): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, this.googleProvider));
  }

  // Inicio de sesión con email/contraseña
  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Registro con email/contraseña
  register(email: string, password: string): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(async (result) => {
        const token = await getIdToken(result.user); // Obtener el token del usuario
        return { user: result.user, token }; // Retornar usuario y token
      })
    );
  }

  // Cerrar sesión
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  // Sincronización del usuario con el backend
  syncUserWithBackend(user: any): Observable<any> {
    // Envía solo los datos esenciales
    const userPayload = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    return this.http.post(`${this.apiUrl}/sync-user`, userPayload);
  }
}
