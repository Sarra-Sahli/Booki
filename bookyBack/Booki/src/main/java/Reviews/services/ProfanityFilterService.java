package Reviews.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfanityFilterService {

    private List<String> customBadWords;

    public ProfanityFilterService() {
        try {
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("badwords.txt");
            if (inputStream == null) {
                throw new RuntimeException("Fichier badwords.txt introuvable !");
            }
            customBadWords = new BufferedReader(new InputStreamReader(inputStream))
                    .lines()
                    .map(String::toLowerCase)
                    .collect(Collectors.toList());

            // Ajouter un log pour vérifier que la liste des mots est bien chargée
            System.out.println("Liste des mots interdits : " + customBadWords);

        } catch (Exception e) {
            // Log et gestion d'erreur
            System.out.println("Erreur lors du chargement du fichier des mots interdits : " + e.getMessage());
            customBadWords = new ArrayList<>();
        }
    }

    public boolean containsBadWords(String text) {
        String lowerText = text.toLowerCase();
        return customBadWords.stream().anyMatch(lowerText::contains);
    }
}

