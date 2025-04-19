import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint, ComplaintStatistics } from '../models/complaint';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = `${environment.gatewayUrl}/api/complaints`;

  constructor(private http: HttpClient) { }

  // Créer une nouvelle réclamation
  createComplaint(complaint: Complaint): Observable<Complaint> {
    return this.http.post<Complaint>(this.apiUrl, complaint);
  }

  // Récupérer toutes les réclamations avec pagination et filtres
  getComplaints(
    page: number = 1,
    limit: number = 10,
    status?: string,
    category?: string,
    priority?: string,
    userEmail?: string,
    sortBy: string = 'createdAt',
    sortOrder: string = 'desc'
  ): Observable<{ complaints: Complaint[], totalPages: number, currentPage: number, totalItems: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    if (status) params = params.set('status', status);
    if (category) params = params.set('category', category);
    if (priority) params = params.set('priority', priority);
    if (userEmail) params = params.set('userEmail', userEmail);

    return this.http.get<{ complaints: Complaint[], totalPages: number, currentPage: number, totalItems: number }>(
      this.apiUrl,
      { params }
    );
  }

  // Récupérer une réclamation par son ID
  getComplaintById(id: string): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour une réclamation
  updateComplaint(id: string, complaint: Partial<Complaint>): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.apiUrl}/${id}`, complaint);
  }

  // Supprimer une réclamation
  deleteComplaint(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour le statut d'une réclamation
  updateStatus(id: string, status: string): Observable<Complaint> {
    return this.http.patch<Complaint>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Ajouter une réponse admin
  addAdminResponse(id: string, adminResponse: string): Observable<Complaint> {
    return this.http.patch<Complaint>(`${this.apiUrl}/${id}/admin-response`, { adminResponse });
  }

  // Marquer une réclamation comme résolue
  markAsResolved(id: string): Observable<Complaint> {
    return this.http.patch<Complaint>(`${this.apiUrl}/${id}/resolve`, {});
  }

  // Obtenir des statistiques sur les réclamations
  getStatistics(): Observable<ComplaintStatistics> {
    return this.http.get<ComplaintStatistics>(`${this.apiUrl}/statistics/all`);
  }

  // Récupérer les réclamations d'un utilisateur par email
  getUserComplaints(email: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/user/${email}`);
  }
}
