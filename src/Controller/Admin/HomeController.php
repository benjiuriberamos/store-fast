<?php

namespace App\Controller\Admin;


use App\Helper\Util;
use App\Entity\Product;
use App\Helper\Filemanager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class HomeController extends AbstractController
{

    public function __construct()
    {
    }
    
    #[Route('/', name: 'home')]
    public function home(Request $request, EntityManagerInterface $entityManager): Response
    {
        $products = $entityManager->getRepository(Product::class)->findAll();
        $products = array_filter($products, function($e) {
            return isset($e->getImages()[0]);
        });
        // dump($products);exit;
        $products = array_chunk($products, 2);
        $data['products'] = $products;
        
        return $this->render('front/home.html.twig', $data);
    }

}
