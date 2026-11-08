<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class StimulusDemoController extends AbstractController
{
    #[Route('/stimulus_demo', name: 'app_stimulus_demo')]
    public function index(): Response
    {

    
        return $this->render('stimulus_demo/index.html.twig');
    }
}
