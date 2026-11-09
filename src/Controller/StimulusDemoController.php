<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class StimulusDemoController extends AbstractController
{
    #[Route('/stimulus_demo', name: 'app_stimulus_demo')]
    public function index(): Response
    {


        return $this->render('stimulus_demo/index.html.twig');
    }

    #[Route('/aoi_dossier_suggestions', name: 'app_api_dossier_suggestions')]
    public function suggest(Request $request): JsonResponse
    {

$x=$request->query->get('q');
    return $this->json(['aaa','bbbbb','ccc']);
    }


}
