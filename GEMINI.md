# Documentation & Règles - Application Facturio

Ce document sert à la fois de documentation sur le projet actuel et de guide ("System Prompt" / Règles) pour tout modèle IA amené à interagir avec cette base de code.

## 1. Ce que l'application fait

L'application est un tableau de bord SaaS de facturation ("Facturio"). Elle permet à une entreprise ou à un indépendant de :
- Gérer ses factures (création, suivi des statuts, aperçu).
- Gérer sa base de clients.
- Consulter un tableau de bord résumant l'activité financière (montants facturés, encaissés, en attente, en retard).
- Paramétrer ses informations d'entreprise et ses préférences.

## 2. Toutes les fonctionnalités implémentées

- **Tableau de bord (Dashboard) :** Affichage des KPIs financiers (Total facturé, encaissé, en attente, en retard) et de la liste des dernières factures.
- **Liste des factures :** Affichage tabulaire avec barre de recherche (par nom ou ID) et filtre par statut.
- **Édition rapide des statuts :** Modification interactive et instantanée du statut d'une facture directement depuis la liste (le badge visuel est transformé en menu déroulant `select`).
- **Création de facture :** Formulaire de création complet avec :
  - Sélection du client.
  - Définition des dates (émission, échéance).
  - Ajout dynamique de lignes de facturation (description, quantité, prix unitaire) avec calcul automatique des sous-totaux, TVA (18%) et Total TTC.
  - Aperçu en direct (Live Preview) formaté comme un document A4 prêt à imprimer.
- **Modale de succès :** Affichage d'une boîte de dialogue lors de l'enregistrement de facture, offrant la possibilité de retourner à la liste ou de télécharger la facture en PDF (via la fenêtre d'impression native du navigateur).
- **Page des paramètres (Settings) :** Interfaces permettant de définir le profil utilisateur, les informations de l'entreprise (SIRET, Adresse) et les préférences (Langue, Devise).
- **Navigation :** Barre latérale (Sidebar) et barre supérieure (Topbar) réactives adaptées aux mobiles et aux écrans de bureau.

## 3. La structure des fichiers

La structure suit l'architecture standard de Next.js App Router (`/app`) :

- `/app` : Contient les différentes pages et routes de l'application (`/dashboard`, `/invoices`, `/invoices/create`, `/clients`, `/settings`).
- `/components/layout` : Composants structurels globaux (`Sidebar.tsx`, `Topbar.tsx`).
- `/components/ui` : Composants atomiques réutilisables basés sur Tailwind CSS (Boutons, Cartes, Badges, Inputs, Select, Tables).
- `/lib` : Fonctions utilitaires.
  - `/lib/utils.ts` : Utilitaire `cn` pour fusionner les classes Tailwind.
  - `/lib/format.ts` : Formatage des dates et des devises (FCFA).
  - `/lib/mock/data.ts` : Données statiques (Mocks) pour simuler la base de données.

## 4. Les technologies utilisées

- **Framework :** React & Next.js (App Router, Client Components).
- **Langage :** TypeScript.
- **Styling :** Tailwind CSS.
- **Icônes :** `lucide-react`.

## 5. Les décisions de design

Les décisions suivantes ont été prises pour assurer un rendu premium et cohérent :

### Color Palette & Theming
- **Core UI (Neutral) :** Backgrounds (`bg-white`, `bg-slate-50`, `bg-slate-100`), Textes primaires (`text-slate-900`), Textes secondaires (`text-slate-500`), Bordures (`border-slate-200`, `border-slate-100`).
- **Semantic Colors :** 
  - *Success (Payée/Valide)* : `bg-green-100`, `text-green-600`, `border-green-200`.
  - *Warning (En Attente/Envoyée)* : `bg-orange-100`, `text-orange-600`, `border-orange-200`.
  - *Danger (En Retard/Erreur)* : `bg-red-100`, `text-red-600`, `border-red-200`.
  - *Info/Accent* : `bg-blue-100`, `text-blue-600`.

### Typography
- **Titres de page :** `text-2xl font-bold text-slate-900`.
- **Titres de sections / Cartes :** `text-lg font-semibold`.
- **En-têtes de table :** `font-medium text-sm text-slate-500 uppercase`.

### Spacing & Layout
- Espacement vertical majeur via `space-y-6`.
- Padding des cartes standardisé à `p-6`.
- Bordures : `rounded-xl` pour les gros éléments (Cartes) et `rounded-full` pour les badges.

### Micro-Animations & Effects (CRITIQUE)
- **Cartes interactives :** `group hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer`.
- **Icônes :** Ajout de `group-hover:scale-110 transition-transform duration-300` pour un effet dynamique au survol.
- **Lignes de tableau :** `hover:bg-slate-50/50 transition-colors`.
- **Gestion du texte :** Utilisation systématique de classes comme `truncate w-full min-w-0` pour éviter que les longs textes ne débordent de leurs conteneurs.

## 6. Instructions pour un futur modèle IA

Si vous êtes une intelligence artificielle assignée à la modification ou à l'extension de cette base de code, **VOUS DEVEZ RESPECTER STRICTEMENT** les règles suivantes :

1. **Stack Technique & Architecture :**
   - Utilisez systématiquement Tailwind CSS pour le style. Ne créez pas de fichiers CSS personnalisés à moins d'y être forcé.
   - Extrayez les composants atomiques réutilisables dans `components/ui/`.
   - Assurez-vous que tous les composants personnalisés acceptent la propriété `className` et la fusionnent correctement avec l'utilitaire `cn` (`import { cn } from "@/lib/utils"`).
   - Exportez les composants en utilisant le motif "compound components" quand applicable (ex: `Card`, `CardHeader`, `CardTitle`).

2. **Design & Esthétique :**
   - N'utilisez pas de couleurs arbitraires. Respectez scrupuleusement la palette `slate` décrite dans la section "Décisions de design".
   - Conservez les effets de micro-animations (hover states, transformations légères) pour maintenir un aspect "premium".

3. **Logique Métier & Données :**
   - Lors de la création de nouvelles interfaces, utilisez les données simulées (mocks) existantes dans `@/lib/mock/data.ts` ou créez-en de nouvelles selon le même format.
   - Lors du passage de composants statiques à des composants interactifs (comme ce fut le cas pour les statuts de facture), assurez-vous d'utiliser `'use client';` au sommet du fichier, et migrez les données importées dans un état local (ex: `useState`) afin de supporter les mises à jour UI en temps réel.
