import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, from, map, throwError } from 'rxjs';
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
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://5000-idx-auth-servcie-ia-app-1731683870257.cluster-2xid2zxbenc4ixa74rpk7q7fyk.cloudworkstations.dev/auth'; // URL de tu backend
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
    debugger;
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2Nsb3VkLmdvb2dsZS5jb20vd29ya3N0YXRpb25zIiwiYXVkIjoiaWR4LWF1dGgtc2VydmNpZS1pYS1hcHAtMTczMTY4Mzg3MDI1Ny5jbHVzdGVyLTJ4aWQyenhiZW5jNGl4YTc0cnBrN3E3ZnlrLmNsb3Vkd29ya3N0YXRpb25zLmRldiIsImlhdCI6MTczMjAzNjUzNSwiZXhwIjoxNzMyMTIyOTM1fQ.IBdha9YpwqbAfe3VIZPCtdLkwlKqyvBrKedIZekdRTP-5EeC1I0EGhvbHh3F9xnES6TfnDVQN471FVWielxxhtlLEEH6mB14j7-NbNfw9-jkRIrrAsgi6y6nHhUcSZ8tG1iJ0sc-5vs_26vKUVFapn7pnKAFWBPl64Sv3yy7xOZlIc2-H3fP53MNIJ6XLsehySDKmQXWKD0qxr1vt_M8kmVRXsam3a73ZUdRci-DVx1uU9xllP4lm9cFcht-ZZ6OZ1QD93XcHSlSEp9i4v1k1TfJ4wKG6scOFJnGPTjPmUDVukdN90rTWHHIXwOgluD-njLraTlE1AWnFkRIw2IRDA';

    // Configura los encabezados
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    // Envía solo los datos esenciales
    const userPayload = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    return this.http.get(`${this.apiUrl}`, {headers}).pipe(
      map((res: any) => {
        return res;
      }), catchError((error) => {
        return throwError(error);
      })  
    );
  }
}
