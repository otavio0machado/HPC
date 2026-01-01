import React from 'react';

// Registry of all lazy-loaded lesson content
export const CONTENT_REGISTRY: { [key: string]: React.LazyExoticComponent<React.FC> } = {
    // CHEMISTRY
    'chemistry_atomistica_modelos': React.lazy(() => import('../../content/registry/chemistry/atomistica/LessonModelosAtomicos')),
    'chemistry_atomistica_tabela': React.lazy(() => import('../../content/registry/chemistry/atomistica/LessonTabelaPeriodica')),
    'chemistry_ligacoes_geometria': React.lazy(() => import('../../content/registry/chemistry/ligacoes/LessonLigacoes')),
    'chemistry_funcoes_inorganicas': React.lazy(() => import('../../content/registry/chemistry/funcoes/LessonFuncoesInorganicas')),
    'chemistry_estequiometria_leis': React.lazy(() => import('../../content/registry/chemistry/estequiometria/LessonEstequiometria')),
    'chemistry_solucoes_intro': React.lazy(() => import('../../content/registry/chemistry/solucoes/LessonSolucoes')),
    'chemistry_termoquimica_intro': React.lazy(() => import('../../content/registry/chemistry/termoquimica/LessonTermoquimica')),
    'chemistry_cinetica_equilibrio': React.lazy(() => import('../../content/registry/chemistry/cinetica/LessonCinetica')),
    'chemistry_organica_funcoes': React.lazy(() => import('../../content/registry/chemistry/organica/LessonFuncoesOrganicas')),
    'chemistry_organica_reacoes': React.lazy(() => import('../../content/registry/chemistry/organica/LessonReacoesOrganicas')),

    // MATHEMATICS
    'mathematics_sequences_finance': React.lazy(() => import('../../content/registry/mathematics/sequences/LessonSequencesFinance').then(module => ({ default: module.LessonSequencesFinance }))),
    'mathematics_trig_circle': React.lazy(() => import('../../content/registry/mathematics/trigonometry/LessonTrigCircle').then(module => ({ default: module.LessonTrigCircle }))),
    'mathematics_trig_triangle': React.lazy(() => import('../../content/registry/mathematics/trigonometry/LessonTrigTriangle').then(module => ({ default: module.LessonTrigTriangle }))),
    'mathematics_combinatoria': React.lazy(() => import('../../content/registry/mathematics/combinatoria/LessonCombinatoria').then(module => ({ default: module.LessonCombinatoria }))),
    'mathematics_probabilidade': React.lazy(() => import('../../content/registry/mathematics/probabilidade/LessonProbabilidade').then(module => ({ default: module.LessonProbabilidade }))),
    'mathematics_geo_plana': React.lazy(() => import('../../content/registry/mathematics/geometry/LessonGeoPlana').then(module => ({ default: module.LessonGeoPlana }))),
    'mathematics_geo_espacial': React.lazy(() => import('../../content/registry/mathematics/geometry/LessonGeoEspacial').then(module => ({ default: module.LessonGeoEspacial }))),
    'mathematics_geo_analitica': React.lazy(() => import('../../content/registry/mathematics/geometry/LessonGeoAnalitica').then(module => ({ default: module.LessonGeoAnalitica }))),
    'mathematics_estatistica': React.lazy(() => import('../../content/registry/mathematics/statistics/LessonEstatistica').then(module => ({ default: module.LessonEstatistica }))),
};


