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
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { environment } from 'src/app/env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';
  private auth;
  private googleProvider;

  constructor(private http: HttpClient) {
    // Initialize Firebase
    const app = initializeApp(environment.firebase);
    this.auth = getAuth(app);
    this.googleProvider = new GoogleAuthProvider();
  }

  // Gmail Sign In
  signInWithGoogle(): Observable<UserCredential> {
    debugger;
    return from(signInWithPopup(this.auth, this.googleProvider));
  }

  // Email/Password Sign In
  login(email: string, password: string): Observable<UserCredential> {
    debugger;
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Email/Password Registration
  register(email: string, password: string): Observable<UserCredential> {
    debugger;
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  // Logout
  logout(): Observable<void> {
    debugger;
    return from(signOut(this.auth));
  }

  // Sync with backend
  syncUserWithBackend(user: any): Observable<any> {
    debugger;
    return this.http.post(`${this.apiUrl}/sync-user`, { user });
  }
}