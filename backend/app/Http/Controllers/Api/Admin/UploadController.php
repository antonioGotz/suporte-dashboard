<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,svg,mp4,mov,avi|max:20480', // max 20MB
        ]);

        // O método store() salva o arquivo na pasta 'storage/app/public'
        // O segundo argumento 'public' garante que ele seja acessível publicamente.
        $path = $request->file('file')->store('uploads', 'public');

        return response()->json(['filePath' => $path]);
    }
}
