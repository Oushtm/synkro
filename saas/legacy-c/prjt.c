#include <stdio.h>

#define MAX_RDV 100
#define TAILLE_TEXTE 50

int nbRendezVous = 0, prochainID = 1;

int ids[MAX_RDV], jours[MAX_RDV], mois[MAX_RDV], annees[MAX_RDV];
int heuresDebut[MAX_RDV], minutesDebut[MAX_RDV];
int heuresFin[MAX_RDV], minutesFin[MAX_RDV];

char lieux[MAX_RDV][TAILLE_TEXTE], categories[MAX_RDV][TAILLE_TEXTE];

/* ========================= PARTIE 1 - OUSSAMA =========================
   Menu principal + affichage + utilitaires de tri/comparaison
   Fonctions: main, afficherMenu, afficherUnRendezVous, afficherTousLesRendezVous,
   comparerDates, comparerHeures, dateAvant, periodeValide, rendezVousAvant
*/
void afficherMenu();
void afficherUnRendezVous(int index);
void afficherTousLesRendezVous();

int comparerDates(int j1, int m1, int a1, int j2, int m2, int a2);
int comparerHeures(int h1, int min1, int h2, int min2);
int dateAvant(int j1, int m1, int a1, int j2, int m2, int a2);
int periodeValide(int hDeb, int minDeb, int hFin, int minFin);

void ajouterRendezVous();
void supprimerRendezVous();
void consulterRendezVous();
void rechercherRendezVous();
void modifierRendezVous();

int chercherIndexParID(int id);
int conflitRendezVous(int jourSaisi, int moisSaisi, int anneeSaisie, int hDeb, int minDeb, int hFin, int minFin, int indexIgnore);
int comparerChaines(char ch1[], char ch2[]);
int rendezVousAvant(int i, int j);

void consulterParDate();
void consulterParPeriode();

void rechercherParID();
void rechercherParDate();
void rechercherParHeure();
void rechercherParLieu();
void rechercherParCategorie();

/* Controle de saisie */
int lireEntierDansIntervalle(char message[], int min, int max);
int dateValide(int jour, int mois, int annee);
int categorieValide(char categorie[]);
int longueurChaine(char ch[]);

int main()
{
    int choix;

    do
    {
        afficherMenu();
        choix = lireEntierDansIntervalle("Entrez votre choix : ", 1, 6);

        switch (choix)
        {
            case 1:
                ajouterRendezVous();
                break;
            case 2:
                supprimerRendezVous();
                break;
            case 3:
                consulterRendezVous();
                break;
            case 4:
                rechercherRendezVous();
                break;
            case 5:
                modifierRendezVous();
                break;
            case 6:
                printf("\nFin du programme.\n");
                break;
        }

    } while (choix != 6);

    return 0;
}

void afficherMenu()
{
    printf("\n==============================\n");
    printf("   GESTION DES RENDEZ-VOUS\n");
    printf("==============================\n");
    printf("1. Ajouter un rendez-vous\n");
    printf("2. Supprimer un rendez-vous\n");
    printf("3. Consulter les rendez-vous\n");
    printf("4. Rechercher un rendez-vous\n");
    printf("5. Modifier un rendez-vous\n");
    printf("6. Quitter\n");
    printf("==============================\n");
}

void afficherUnRendezVous(int index)
{
    printf("\n----------------------------------\n");
    printf("ID          : %d\n", ids[index]);
    printf("Date        : %02d/%02d/%04d\n", jours[index], mois[index], annees[index]);
    printf("Heure debut : %02d:%02d\n", heuresDebut[index], minutesDebut[index]);
    printf("Heure fin   : %02d:%02d\n", heuresFin[index], minutesFin[index]);
    printf("Lieu        : %s\n", lieux[index]);
    printf("Categorie   : %s\n", categories[index]);
    printf("----------------------------------\n");
}

void afficherTousLesRendezVous()
{
    int dejaAffiche[MAX_RDV];
    int i, j, minIndex, trouve;

    if (nbRendezVous == 0)
    {
        printf("\nAucun rendez-vous enregistre.\n");
        return;
    }

    for (i = 0; i < nbRendezVous; i++)
        dejaAffiche[i] = 0;

    printf("\n===== Liste des rendez-vous classes par date et heure =====\n");

    for (i = 0; i < nbRendezVous; i++)
    {
        trouve = 0;
        minIndex = -1;

        for (j = 0; j < nbRendezVous; j++)
        {
            if (dejaAffiche[j] == 0)
            {
                if (trouve == 0)
                {
                    minIndex = j;
                    trouve = 1;
                }
                else if (rendezVousAvant(j, minIndex))
                {
                    minIndex = j;
                }
            }
        }

        if (minIndex != -1)
        {
            afficherUnRendezVous(minIndex);
            dejaAffiche[minIndex] = 1;
        }
    }
}

int comparerDates(int j1, int m1, int a1, int j2, int m2, int a2)
{
    if (a1 < a2)
        return -1;
    else if (a1 > a2)
        return 1;
    else
    {
        if (m1 < m2)
            return -1;
        else if (m1 > m2)
            return 1;
        else
        {
            if (j1 < j2)
                return -1;
            else if (j1 > j2)
                return 1;
            else
                return 0;
        }
    }
}

int comparerHeures(int h1, int min1, int h2, int min2)
{
    if (h1 < h2)
        return -1;
    else if (h1 > h2)
        return 1;
    else
    {
        if (min1 < min2)
            return -1;
        else if (min1 > min2)
            return 1;
        else
            return 0;
    }
}

int dateAvant(int j1, int m1, int a1, int j2, int m2, int a2)
{
    if (comparerDates(j1, m1, a1, j2, m2, a2) == -1)
        return 1;
    else
        return 0;
}

int periodeValide(int hDeb, int minDeb, int hFin, int minFin)
{
    if (comparerHeures(hDeb, minDeb, hFin, minFin) == -1)
        return 1;
    else
        return 0;
}

int chercherIndexParID(int id)
{
    int i;

    for (i = 0; i < nbRendezVous; i++)
    {
        if (ids[i] == id)
            return i;
    }

    return -1;
}

int conflitRendezVous(int jourSaisi, int moisSaisi, int anneeSaisie, int hDeb, int minDeb, int hFin, int minFin, int indexIgnore)
{
    int i;
    int debutNouveau, finNouveau;
    int debutExistant, finExistant;

    debutNouveau = hDeb * 60 + minDeb;
    finNouveau = hFin * 60 + minFin;

    for (i = 0; i < nbRendezVous; i++)
    {
        if (i != indexIgnore)
        {
            if (jours[i] == jourSaisi && mois[i] == moisSaisi && annees[i] == anneeSaisie)
            {
                debutExistant = heuresDebut[i] * 60 + minutesDebut[i];
                finExistant = heuresFin[i] * 60 + minutesFin[i];

                if (debutNouveau < finExistant && finNouveau > debutExistant)
                    return 1;
            }
        }
    }

    return 0;
}

int comparerChaines(char ch1[], char ch2[])
{
    int i = 0;

    while (ch1[i] != '\0' && ch2[i] != '\0')
    {
        if (ch1[i] != ch2[i])
            return 0;
        i++;
    }

    if (ch1[i] == '\0' && ch2[i] == '\0')
        return 1;
    else
        return 0;
}

int rendezVousAvant(int i, int j)
{
    int cmpDate, cmpHeure;

    cmpDate = comparerDates(jours[i], mois[i], annees[i], jours[j], mois[j], annees[j]);

    if (cmpDate == -1)
        return 1;
    else if (cmpDate == 1)
        return 0;
    else
    {
        cmpHeure = comparerHeures(heuresDebut[i], minutesDebut[i], heuresDebut[j], minutesDebut[j]);

        if (cmpHeure == -1)
            return 1;
        else
            return 0;
    }
}


/* ========================= PARTIE 2 - OTHMANE =========================
   Controle de saisie + validations + ajout/suppression
   Fonctions: lireEntierDansIntervalle, dateValide, categorieValide, longueurChaine,
   chercherIndexParID, conflitRendezVous, comparerChaines, ajouterRendezVous,
   supprimerRendezVous
*/
int lireEntierDansIntervalle(char message[], int min, int max)
{
    int x;

    do
    {
        printf("%s", message);
        scanf("%d", &x);

        if (x < min || x > max)
            printf("Valeur invalide. Entrez une valeur entre %d et %d.\n", min, max);

    } while (x < min || x > max);

    return x;
}

int dateValide(int jour, int mois, int annee)
{
    int maxJour;

    if (annee < 1900 || annee > 2100)
        return 0;

    if (mois < 1 || mois > 12)
        return 0;

    if (mois == 1 || mois == 3 || mois == 5 || mois == 7 || mois == 8 || mois == 10 || mois == 12)
        maxJour = 31;
    else if (mois == 4 || mois == 6 || mois == 9 || mois == 11)
        maxJour = 30;
    else
    {
        if ((annee % 4 == 0 && annee % 100 != 0) || (annee % 400 == 0))
            maxJour = 29;
        else
            maxJour = 28;
    }

    if (jour < 1 || jour > maxJour)
        return 0;

    return 1;
}

int categorieValide(char categorie[])
{
    if (comparerChaines(categorie, "professionnel") == 1)
        return 1;
    if (comparerChaines(categorie, "personnel") == 1)
        return 1;
    if (comparerChaines(categorie, "medical") == 1)
        return 1;

    return 0;
}

int longueurChaine(char ch[])
{
    int i = 0;

    while (ch[i] != '\0')
        i++;

    return i;
}

void ajouterRendezVous()
{
    int jourSaisi, moisSaisi, anneeSaisie;
    int hDeb, minDeb, hFin, minFin;
    char lieu[TAILLE_TEXTE], categorie[TAILLE_TEXTE];
    int i;

    if (nbRendezVous >= MAX_RDV)
    {
        printf("\nLe tableau des rendez-vous est plein.\n");
        return;
    }

    printf("\n===== Ajouter un rendez-vous =====\n");

    do
    {
        jourSaisi = lireEntierDansIntervalle("Jour : ", 1, 31);
        moisSaisi = lireEntierDansIntervalle("Mois : ", 1, 12);
        anneeSaisie = lireEntierDansIntervalle("Annee : ", 1900, 2100);

        if (dateValide(jourSaisi, moisSaisi, anneeSaisie) == 0)
            printf("Date invalide. Recommencez.\n");

    } while (dateValide(jourSaisi, moisSaisi, anneeSaisie) == 0);

    hDeb = lireEntierDansIntervalle("Heure de debut : ", 0, 23);
    minDeb = lireEntierDansIntervalle("Minute de debut : ", 0, 59);
    hFin = lireEntierDansIntervalle("Heure de fin : ", 0, 23);
    minFin = lireEntierDansIntervalle("Minute de fin : ", 0, 59);

    printf("Lieu : ");
    scanf("%s", lieu);

    do
    {
        printf("Categorie (professionnel/personnel/medical) : ");
        scanf("%s", categorie);

        if (categorieValide(categorie) == 0)
            printf("Categorie invalide.\n");

    } while (categorieValide(categorie) == 0);

    if (periodeValide(hDeb, minDeb, hFin, minFin) == 0)
    {
        printf("\nPeriode invalide : l'heure de debut doit etre avant l'heure de fin.\n");
        return;
    }

    if (conflitRendezVous(jourSaisi, moisSaisi, anneeSaisie, hDeb, minDeb, hFin, minFin, -1) == 1)
    {
        printf("\nConflit horaire : ce rendez-vous chevauche un autre rendez-vous.\n");
        return;
    }

    ids[nbRendezVous] = prochainID;
    jours[nbRendezVous] = jourSaisi;
    mois[nbRendezVous] = moisSaisi;
    annees[nbRendezVous] = anneeSaisie;
    heuresDebut[nbRendezVous] = hDeb;
    minutesDebut[nbRendezVous] = minDeb;
    heuresFin[nbRendezVous] = hFin;
    minutesFin[nbRendezVous] = minFin;

    i = 0;
    while (lieu[i] != '\0')
    {
        lieux[nbRendezVous][i] = lieu[i];
        i++;
    }
    lieux[nbRendezVous][i] = '\0';

    i = 0;
    while (categorie[i] != '\0')
    {
        categories[nbRendezVous][i] = categorie[i];
        i++;
    }
    categories[nbRendezVous][i] = '\0';

    nbRendezVous++;
    prochainID++;

    printf("\nRendez-vous ajoute avec succes.\n");
}

void supprimerRendezVous()
{
    int id, index, i, j;

    if (nbRendezVous == 0)
    {
        printf("\nAucun rendez-vous a supprimer.\n");
        return;
    }

    printf("\n===== Supprimer un rendez-vous =====\n");
    printf("Entrez l'ID du rendez-vous a supprimer : ");
    scanf("%d", &id);

    index = chercherIndexParID(id);

    if (index == -1)
    {
        printf("\nRendez-vous introuvable.\n");
        return;
    }

    for (i = index; i < nbRendezVous - 1; i++)
    {
        ids[i] = ids[i + 1];
        jours[i] = jours[i + 1];
        mois[i] = mois[i + 1];
        annees[i] = annees[i + 1];
        heuresDebut[i] = heuresDebut[i + 1];
        minutesDebut[i] = minutesDebut[i + 1];
        heuresFin[i] = heuresFin[i + 1];
        minutesFin[i] = minutesFin[i + 1];

        j = 0;
        while (lieux[i + 1][j] != '\0')
        {
            lieux[i][j] = lieux[i + 1][j];
            j++;
        }
        lieux[i][j] = '\0';

        j = 0;
        while (categories[i + 1][j] != '\0')
        {
            categories[i][j] = categories[i + 1][j];
            j++;
        }
        categories[i][j] = '\0';
    }

    nbRendezVous--;

    printf("\nRendez-vous supprime avec succes.\n");
}

/* ========================== PARTIE 3 - ILYASS ==========================
   Consultation des rendez-vous
   Fonctions: consulterRendezVous, consulterParDate, consulterParPeriode
*/
void consulterRendezVous()
{
    int choix;

    if (nbRendezVous == 0)
    {
        printf("\nAucun rendez-vous enregistre.\n");
        return;
    }

    printf("\n===== Consultation =====\n");
    printf("1. Afficher tous les rendez-vous\n");
    printf("2. Afficher les rendez-vous d'une date\n");
    printf("3. Afficher les rendez-vous d'une periode\n");
    choix = lireEntierDansIntervalle("Choix : ", 1, 3);

    switch (choix)
    {
        case 1:
            afficherTousLesRendezVous();
            break;
        case 2:
            consulterParDate();
            break;
        case 3:
            consulterParPeriode();
            break;
    }
}

void consulterParDate()
{
    int jourSaisi, moisSaisi, anneeSaisie;
    int i, trouve = 0;
    int dejaAffiche[MAX_RDV];
    int k, minIndex, existe;

    do
    {
        jourSaisi = lireEntierDansIntervalle("Jour : ", 1, 31);
        moisSaisi = lireEntierDansIntervalle("Mois : ", 1, 12);
        anneeSaisie = lireEntierDansIntervalle("Annee : ", 1900, 2100);

        if (dateValide(jourSaisi, moisSaisi, anneeSaisie) == 0)
            printf("Date invalide. Recommencez.\n");

    } while (dateValide(jourSaisi, moisSaisi, anneeSaisie) == 0);

    for (i = 0; i < nbRendezVous; i++)
        dejaAffiche[i] = 0;

    printf("\n===== Rendez-vous du %02d/%02d/%04d =====\n", jourSaisi, moisSaisi, anneeSaisie);

    for (k = 0; k < nbRendezVous; k++)
    {
        existe = 0;
        minIndex = -1;

        for (i = 0; i < nbRendezVous; i++)
        {
            if (dejaAffiche[i] == 0 && jours[i] == jourSaisi && mois[i] == moisSaisi && annees[i] == anneeSaisie)
            {
                if (existe == 0)
                {
                    minIndex = i;
                    existe = 1;
                }
                else if (rendezVousAvant(i, minIndex))
                {
                    minIndex = i;
                }
            }
        }

        if (minIndex != -1)
        {
            afficherUnRendezVous(minIndex);
            dejaAffiche[minIndex] = 1;
            trouve = 1;
        }
    }

    if (trouve == 0)
        printf("\nAucun rendez-vous pour cette date.\n");
}

void consulterParPeriode()
{
    int j1, m1, a1, j2, m2, a2;
    int i, trouve = 0;
    int dejaAffiche[MAX_RDV];
    int k, minIndex, existe;

    printf("\nDate de debut\n");
    do
    {
        j1 = lireEntierDansIntervalle("Jour : ", 1, 31);
        m1 = lireEntierDansIntervalle("Mois : ", 1, 12);
        a1 = lireEntierDansIntervalle("Annee : ", 1900, 2100);

        if (dateValide(j1, m1, a1) == 0)
            printf("Date invalide. Recommencez.\n");

    } while (dateValide(j1, m1, a1) == 0);

    printf("\nDate de fin\n");
    do
    {
        j2 = lireEntierDansIntervalle("Jour : ", 1, 31);
        m2 = lireEntierDansIntervalle("Mois : ", 1, 12);
        a2 = lireEntierDansIntervalle("Annee : ", 1900, 2100);

        if (dateValide(j2, m2, a2) == 0)
            printf("Date invalide. Recommencez.\n");

    } while (dateValide(j2, m2, a2) == 0);

    if (comparerDates(j1, m1, a1, j2, m2, a2) == 1)
    {
        printf("\nPeriode invalide : la date de debut doit etre avant ou egale a la date de fin.\n");
        return;
    }

    for (i = 0; i < nbRendezVous; i++)
        dejaAffiche[i] = 0;

    printf("\n===== Rendez-vous de la periode =====\n");

    for (k = 0; k < nbRendezVous; k++)
    {
        existe = 0;
        minIndex = -1;

        for (i = 0; i < nbRendezVous; i++)
        {
            if (dejaAffiche[i] == 0)
            {
                if (comparerDates(jours[i], mois[i], annees[i], j1, m1, a1) != -1 &&
                    comparerDates(jours[i], mois[i], annees[i], j2, m2, a2) != 1)
                {
                    if (existe == 0)
                    {
                        minIndex = i;
                        existe = 1;
                    }
                    else if (rendezVousAvant(i, minIndex))
                    {
                        minIndex = i;
                    }
                }
            }
        }

        if (minIndex != -1)
        {
            afficherUnRendezVous(minIndex);
            dejaAffiche[minIndex] = 1;
            trouve = 1;
        }
    }

    if (trouve == 0)
        printf("\nAucun rendez-vous dans cette periode.\n");
}

/* ========================== PARTIE 4 - YAHYA ===========================
   Recherche + modification des rendez-vous
   Fonctions: rechercherRendezVous, rechercherParID, rechercherParDate,
   rechercherParHeure, rechercherParLieu, rechercherParCategorie, modifierRendezVous
*/
void rechercherRendezVous()
{
    int choix;

    if (nbRendezVous == 0)
    {
        printf("\nAucun rendez-vous enregistre.\n");
        return;
    }

    printf("\n===== Recherche =====\n");
    printf("1. Rechercher par ID\n");
    printf("2. Rechercher par date\n");
    printf("3. Rechercher par heure\n");
    printf("4. Rechercher par lieu\n");
    printf("5. Rechercher par categorie\n");
    choix = lireEntierDansIntervalle("Choix : ", 1, 5);

    switch (choix)
    {
        case 1:
            rechercherParID();
            break;
        case 2:
            rechercherParDate();
            break;
        case 3:
            rechercherParHeure();
            break;
        case 4:
            rechercherParLieu();
            break;
        case 5:
            rechercherParCategorie();
            break;
    }
}

void rechercherParID()
{
    int id, index;

    printf("\nEntrez l'ID : ");
    scanf("%d", &id);

    index = chercherIndexParID(id);

    if (index == -1)
        printf("\nRendez-vous introuvable.\n");
    else
        afficherUnRendezVous(index);
}

void rechercherParDate()
{
    int jourSaisi, moisSaisi, anneeSaisie;
    int i, trouve = 0;

    do
    {
        jourSaisi = lireEntierDansIntervalle("Jour : ", 1, 31);
        moisSaisi = lireEntierDansIntervalle("Mois : ", 1, 12);
        anneeSaisie = lireEntierDansIntervalle("Annee : ", 1900, 2100);

        if (dateValide(jourSaisi, moisSaisi, anneeSaisie) == 0)
            printf("Date invalide. Recommencez.\n");

    } while (dateValide(jourSaisi, moisSaisi, anneeSaisie) == 0);

    for (i = 0; i < nbRendezVous; i++)
    {
        if (jours[i] == jourSaisi && mois[i] == moisSaisi && annees[i] == anneeSaisie)
        {
            afficherUnRendezVous(i);
            trouve = 1;
        }
    }

    if (trouve == 0)
        printf("\nAucun rendez-vous trouve pour cette date.\n");
}

void rechercherParHeure()
{
    int h, min;
    int i, trouve = 0;

    h = lireEntierDansIntervalle("Heure de debut : ", 0, 23);
    min = lireEntierDansIntervalle("Minute de debut : ", 0, 59);

    for (i = 0; i < nbRendezVous; i++)
    {
        if (heuresDebut[i] == h && minutesDebut[i] == min)
        {
            afficherUnRendezVous(i);
            trouve = 1;
        }
    }

    if (trouve == 0)
        printf("\nAucun rendez-vous trouve pour cette heure.\n");
}

void rechercherParLieu()
{
    char lieu[TAILLE_TEXTE];
    int i, trouve = 0;

    printf("\nEntrez le lieu : ");
    scanf("%s", lieu);

    if (longueurChaine(lieu) == 0)
    {
        printf("\nLieu invalide.\n");
        return;
    }

    for (i = 0; i < nbRendezVous; i++)
    {
        if (comparerChaines(lieux[i], lieu) == 1)
        {
            afficherUnRendezVous(i);
            trouve = 1;
        }
    }

    if (trouve == 0)
        printf("\nAucun rendez-vous trouve pour ce lieu.\n");
}

void rechercherParCategorie()
{
    char categorie[TAILLE_TEXTE];
    int i, trouve = 0;

    do
    {
        printf("\nEntrez la categorie (professionnel/personnel/medical) : ");
        scanf("%s", categorie);

        if (categorieValide(categorie) == 0)
            printf("Categorie invalide.\n");

    } while (categorieValide(categorie) == 0);

    for (i = 0; i < nbRendezVous; i++)
    {
        if (comparerChaines(categories[i], categorie) == 1)
        {
            afficherUnRendezVous(i);
            trouve = 1;
        }
    }

    if (trouve == 0)
        printf("\nAucun rendez-vous trouve pour cette categorie.\n");
}

void modifierRendezVous()
{
    int id, index, choix;
    int ancienJour, ancienMois, ancienneAnnee;
    int ancienneHeureDeb, ancienneMinuteDeb, ancienneHeureFin, ancienneMinuteFin;
    char ancienLieu[TAILLE_TEXTE], ancienneCategorie[TAILLE_TEXTE];
    int i;

    if (nbRendezVous == 0)
    {
        printf("\nAucun rendez-vous a modifier.\n");
        return;
    }

    printf("\n===== Modifier un rendez-vous =====\n");
    printf("Entrez l'ID du rendez-vous : ");
    scanf("%d", &id);

    index = chercherIndexParID(id);

    if (index == -1)
    {
        printf("\nRendez-vous introuvable.\n");
        return;
    }

    afficherUnRendezVous(index);

    ancienJour = jours[index];
    ancienMois = mois[index];
    ancienneAnnee = annees[index];
    ancienneHeureDeb = heuresDebut[index];
    ancienneMinuteDeb = minutesDebut[index];
    ancienneHeureFin = heuresFin[index];
    ancienneMinuteFin = minutesFin[index];

    i = 0;
    while (lieux[index][i] != '\0')
    {
        ancienLieu[i] = lieux[index][i];
        i++;
    }
    ancienLieu[i] = '\0';

    i = 0;
    while (categories[index][i] != '\0')
    {
        ancienneCategorie[i] = categories[index][i];
        i++;
    }
    ancienneCategorie[i] = '\0';

    printf("\n1. Modifier la date\n");
    printf("2. Modifier l'heure de debut\n");
    printf("3. Modifier l'heure de fin\n");
    printf("4. Modifier le lieu\n");
    printf("5. Modifier la categorie\n");
    choix = lireEntierDansIntervalle("Choix : ", 1, 5);

    switch (choix)
    {
        case 1:
            do
            {
                jours[index] = lireEntierDansIntervalle("Nouveau jour : ", 1, 31);
                mois[index] = lireEntierDansIntervalle("Nouveau mois : ", 1, 12);
                annees[index] = lireEntierDansIntervalle("Nouvelle annee : ", 1900, 2100);

                if (dateValide(jours[index], mois[index], annees[index]) == 0)
                    printf("Date invalide. Recommencez.\n");

            } while (dateValide(jours[index], mois[index], annees[index]) == 0);
            break;

        case 2:
            heuresDebut[index] = lireEntierDansIntervalle("Nouvelle heure de debut : ", 0, 23);
            minutesDebut[index] = lireEntierDansIntervalle("Nouvelle minute de debut : ", 0, 59);
            break;

        case 3:
            heuresFin[index] = lireEntierDansIntervalle("Nouvelle heure de fin : ", 0, 23);
            minutesFin[index] = lireEntierDansIntervalle("Nouvelle minute de fin : ", 0, 59);
            break;

        case 4:
            printf("Nouveau lieu : ");
            scanf("%s", lieux[index]);
            break;

        case 5:
            do
            {
                printf("Nouvelle categorie (professionnel/personnel/medical) : ");
                scanf("%s", categories[index]);

                if (categorieValide(categories[index]) == 0)
                    printf("Categorie invalide.\n");

            } while (categorieValide(categories[index]) == 0);
            break;
    }

    if (periodeValide(heuresDebut[index], minutesDebut[index], heuresFin[index], minutesFin[index]) == 0)
    {
        jours[index] = ancienJour;
        mois[index] = ancienMois;
        annees[index] = ancienneAnnee;
        heuresDebut[index] = ancienneHeureDeb;
        minutesDebut[index] = ancienneMinuteDeb;
        heuresFin[index] = ancienneHeureFin;
        minutesFin[index] = ancienneMinuteFin;

        i = 0;
        while (ancienLieu[i] != '\0')
        {
            lieux[index][i] = ancienLieu[i];
            i++;
        }
        lieux[index][i] = '\0';

        i = 0;
        while (ancienneCategorie[i] != '\0')
        {
            categories[index][i] = ancienneCategorie[i];
            i++;
        }
        categories[index][i] = '\0';

        printf("\nModification refusee : heure de debut invalide.\n");
        return;
    }

    if (conflitRendezVous(jours[index], mois[index], annees[index],
                          heuresDebut[index], minutesDebut[index],
                          heuresFin[index], minutesFin[index], index) == 1)
    {
        jours[index] = ancienJour;
        mois[index] = ancienMois;
        annees[index] = ancienneAnnee;
        heuresDebut[index] = ancienneHeureDeb;
        minutesDebut[index] = ancienneMinuteDeb;
        heuresFin[index] = ancienneHeureFin;
        minutesFin[index] = ancienneMinuteFin;

        i = 0;
        while (ancienLieu[i] != '\0')
        {
            lieux[index][i] = ancienLieu[i];
            i++;
        }
        lieux[index][i] = '\0';

        i = 0;
        while (ancienneCategorie[i] != '\0')
        {
            categories[index][i] = ancienneCategorie[i];
            i++;
        }
        categories[index][i] = '\0';

        printf("\nModification refusee : conflit horaire avec un autre rendez-vous.\n");
        return;
    }

    printf("\nRendez-vous modifie avec succes.\n");
}