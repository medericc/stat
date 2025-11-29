'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from 'react';

import VideoHeader from './components/VideoHeader';
import InputForm from './components/InputForm';
import MatchTable from './components/MatchTable';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface MatchAction {
    period: string;
    gt: string; // Game time
    actionType: string;
    success: boolean;
    s1: string; // Score team 1
    s2: string; // Score team 2
    player: string; // Nom du joueur
    familyName: string;
}

interface MatchData {
    pbp: MatchAction[]; // Play-by-play data
}

export default function Home() {
    const [csvGenerated, setCsvGenerated] = useState(false);
    const [csvData, setCsvData] = useState<string[][]>([]);
    const [selectedLink, setSelectedLink] = useState<string>(''); // État pour le lien sélectionné
    const [customUrl, setCustomUrl] = useState(''); // État pour l'URL personnalisée
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isWaitingModalOpen, setIsWaitingModalOpen] = useState(false);

    const matchLinks: { name: string; url: string }[] = [  
  { name: "La Tronche", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2713826/bs.html" },
    { name: "Pole France", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2713813/bs.html" },
  
  
  
      { name: "Aulnoye", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2713812/bs.html" },
      { name: "Mondeville", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2713803/bs.html" },
      { name: "Feytiat", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2713798/bs.html" },
      { name: "Montbrison", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2713787/bs.html" },
     { name: "Voiron", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2713784/bs.html" },
      { name: "Champagne", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2713772/bs.html" },

      { name: "Rouen", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2713770/bs.html" },

       { name: "Aulnoye", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2713711/bs.html" },
    
    //   { name: "Montbrison 3", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2648651/bs.html" },
    
    //   { name: "Montbrison 2", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2648647/bs.html" },
    //  { name: "Montbrison", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2648643/bs.html" },
       
    //   { name: "Toulouse", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2513460/bs.html" },


    //   { name: "Pole France", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2513446/bs.html" },

    //   { name: "Alençon", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2513427/bs.html" },

    //     { name: "Voiron", url: "https://fibalivestats.dcd.shared.geniussports.com/u/FFBB/2513437/bs.html" },
    ]; 
    
    const handleGenerate = async () => {
        const url = selectedLink || customUrl;
    
        if (!url) {
            setModalMessage("Sélectionne un Match 😎");
            setIsModalOpen(true);
            return;
        }
    
        try {
            const jsonUrl = url
                .replace(/\/u\/FFBB\//, '/data/')
                .replace(/\/bs\.html\/?/, '/')
                .replace(/\/$/, '') + '/data.json';
    
            console.log("URL JSON générée :", jsonUrl);
    
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(jsonUrl)}`;
            const response = await fetch(proxyUrl);
    
            if (!response.ok) {
                console.error("Erreur de récupération :", response.status, await response.text());
                setModalMessage("Léna s'échauffe 🏀");
                setIsWaitingModalOpen(true);
                return;
            }
    
            const data: MatchData = await response.json();
            console.log("Données récupérées :", data);
    
            const filteredData = data.pbp
                .filter((action) => action.familyName === "Monasse")
                .sort((a, b) => b.gt.localeCompare(a.gt));
    
            console.log("Actions triées pour Léna :", filteredData);
    
            const csvContent = generateCSV(filteredData);
            console.log("CSV généré :", csvContent);
    
            const rows = csvContent.split('\n').slice(1).map((row) => row.split(','));
            setCsvData(rows);
            setCsvGenerated(true);
        } catch (error) {
            console.error("Erreur dans generateCsv:", error);
            alert('Une erreur est survenue lors de la génération du CSV.');
        }
    };
    
    const generateCSV = (data: MatchAction[]): string => {
        let csv = 'Période,Horodatage,Action,Réussite,Score\n';
        
        data.forEach((action) => {
            csv += `${action.period},${action.gt},${action.actionType},${action.success ? '1' : '0'},${action.s1}-${action.s2}\n`;
        });
    
        return csv;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-12 gap-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <VideoHeader className="absolute top-0 left-0 w-full" />
        
        <main className="flex flex-col items-center gap-6 w-full max-w-lg sm:max-w-2xl md:max-w-4xl">
          <Select value={selectedLink} onValueChange={setSelectedLink}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionne un match" />
            </SelectTrigger>
            <SelectContent>
              {matchLinks.map((link) => (
                <SelectItem key={link.url} value={link.url}>
                  {link.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
    
          <InputForm 
            value={customUrl} 
            onChange={(e) => setCustomUrl(e.target.value)} 
            onGenerate={handleGenerate} 
          />
    
          {csvGenerated && (
            <div className="w-full overflow-x-auto">
              <MatchTable data={csvData} />
            </div>
          )}
        </main>
    
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="w-[80%] max-w-xs rounded-lg shadow-lg bg-white dark:bg-gray-800 p-6">
                <DialogHeader>
                    <DialogTitle className="text-center mb-4">⚠️ Erreur</DialogTitle>
                    <DialogDescription className="text-center mt-4">{modalMessage}</DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    
        <Dialog open={isWaitingModalOpen} onOpenChange={setIsWaitingModalOpen}>
            <DialogContent className="w-[80%] max-w-xs rounded-lg shadow-lg bg-white dark:bg-gray-800 p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center gap-2 mb-2">⏳ Patiente</DialogTitle>
                    <DialogDescription className="text-center mt-2">{modalMessage}</DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    
        <footer className="text-sm text-gray-900 mt-8">
          <a href="https://www.youtube.com/@fan_lucilej" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Produit par @fan_carlaleite
          </a>
        </footer>
      </div>
    );
}
