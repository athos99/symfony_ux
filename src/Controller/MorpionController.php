<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class MorpionController extends AbstractController
{
    #[Route('/morpion', name: 'app_morpion')]
    public function index(): Response
    {
        return $this->render('morpion/index.html.twig');
    }
}
    