<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class PopulateProductImages extends Command
{
    protected $signature = 'products:populate-images';
    protected $description = 'Popula o campo image dos produtos automaticamente com base nas imagens da pasta storage';

    public function handle()
    {
        $basePath = storage_path('app/public/images');
        $produtos = DB::table('products')->get(['id']);
        $atualizados = 0;

        foreach ($produtos as $produto) {
            $dir = $basePath . DIRECTORY_SEPARATOR . $produto->id;
            if (File::exists($dir) && File::isDirectory($dir)) {
                $arquivos = File::files($dir);
                if (count($arquivos) > 0) {
                    $primeiraImagem = $arquivos[0]->getFilename();
                    $caminhoRelativo = 'images/' . $produto->id . '/' . $primeiraImagem;
                    DB::table('products')->where('id', $produto->id)->update(['image' => $caminhoRelativo]);
                    $atualizados++;
                    $this->info("Produto ID {$produto->id} atualizado com {$caminhoRelativo}");
                }
            }
        }
        $this->info("Total de produtos atualizados: $atualizados");
        return 0;
    }
}
