<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TestStimulusController extends AbstractController
{
    #[Route('/test_stimulus', name: 'app_test_stimulus')]
    public function index(): Response
    {
        return $this->render('test_stimulus/index.html.twig');
    }
}